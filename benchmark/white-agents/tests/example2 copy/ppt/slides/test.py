#!/usr/bin/env python3
"""
Script to parse PowerPoint clipboard binary file and identify content referenced in slide7.xml
"""

import os
import struct
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Any

def parse_slide_xml(slide_xml_path: str) -> Dict[str, Any]:
    """Parse slide7.xml to extract all references and content."""
    print(f"\n=== Parsing {slide_xml_path} ===\n")
    
    tree = ET.parse(slide_xml_path)
    root = tree.getroot()
    
    # Define namespaces
    namespaces = {
        'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
        'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
        'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
    }
    
    references = {
        'images': [],
        'shapes': [],
        'text_content': [],
        'relationships': []
    }
    
    # Parse relationships file
    rels_path = slide_xml_path.replace('slide7.xml', '_rels/slide7.xml.rels')
    if os.path.exists(rels_path):
        rels_tree = ET.parse(rels_path)
        rels_root = rels_tree.getroot()
        for rel in rels_root.findall('.//{http://schemas.openxmlformats.org/package/2006/relationships}Relationship'):
            rel_id = rel.get('Id')
            rel_type = rel.get('Type')
            rel_target = rel.get('Target')
            references['relationships'].append({
                'id': rel_id,
                'type': rel_type,
                'target': rel_target
            })
            print(f"Relationship: {rel_id} -> {rel_target} ({rel_type})")
    
    # Find all picture elements
    pics = root.findall('.//p:pic', namespaces)
    print(f"\nFound {len(pics)} picture elements:")
    for i, pic in enumerate(pics):
        blip = pic.find('.//a:blip', namespaces)
        if blip is not None:
            embed_id = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
            if embed_id:
                # Find the target from relationships
                target = next((r['target'] for r in references['relationships'] if r['id'] == embed_id), None)
                references['images'].append({
                    'embed_id': embed_id,
                    'target': target,
                    'type': 'image'
                })
                print(f"  Picture {i+1}: rId={embed_id}, Target={target}")
            
            # Check for SVG references (nested in extensions)
            svg_namespace = {'asvg': 'http://schemas.microsoft.com/office/drawing/2016/SVG/main'}
            svg_blip = blip.find('.//asvg:svgBlip', svg_namespace)
            if svg_blip is not None:
                svg_embed_id = svg_blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                if svg_embed_id:
                    svg_target = next((r['target'] for r in references['relationships'] if r['id'] == svg_embed_id), None)
                    references['images'].append({
                        'embed_id': svg_embed_id,
                        'target': svg_target,
                        'type': 'svg'
                    })
                    print(f"    SVG variant: rId={svg_embed_id}, Target={svg_target}")
    
    # Find all shapes with text
    shapes = root.findall('.//p:sp', namespaces)
    print(f"\nFound {len(shapes)} shape elements:")
    for i, shape in enumerate(shapes):
        name_elem = shape.find('.//p:cNvPr', namespaces)
        name = name_elem.get('name', 'Unknown') if name_elem is not None else 'Unknown'
        
        # Extract text content
        text_elems = shape.findall('.//a:t', namespaces)
        text_content = ' '.join([t.text for t in text_elems if t.text])
        
        if text_content:
            references['text_content'].append({
                'name': name,
                'text': text_content
            })
            print(f"  Shape {i+1} ({name}): {text_content[:50]}...")
    
    # Find all connection shapes
    cxn_shapes = root.findall('.//p:cxnSp', namespaces)
    print(f"\nFound {len(cxn_shapes)} connection shapes")
    
    # Find all group shapes
    grp_shapes = root.findall('.//p:grpSp', namespaces)
    print(f"Found {len(grp_shapes)} group shapes")
    
    return references


def parse_clipboard_binary(bin_path: str) -> Dict[str, Any]:
    """Parse the PowerPoint clipboard binary file."""
    print(f"\n=== Parsing {bin_path} ===\n")
    
    if not os.path.exists(bin_path):
        print(f"Error: File not found: {bin_path}")
        return {}
    
    file_size = os.path.getsize(bin_path)
    print(f"File size: {file_size} bytes")
    
    with open(bin_path, 'rb') as f:
        # Read the first few bytes to identify the format
        header = f.read(8)
        print(f"Header (hex): {header.hex()}")
        print(f"Header (ascii): {header}")
        
        # Try to identify if it's an OLE2/Compound Document format
        # OLE2 files start with specific signatures
        if header[:8] == b'\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1':
            print("Detected: OLE2/Compound Document format")
            return parse_ole2_format(f, bin_path)
        else:
            print("Unknown format, attempting raw binary parsing...")
            return parse_raw_binary(f, bin_path)


def parse_ole2_format(f, bin_path: str) -> Dict[str, Any]:
    """Parse OLE2/Compound Document format."""
    # This is a simplified parser - OLE2 format is complex
    # For now, we'll try to extract readable strings and structure info
    f.seek(0)
    data = f.read()
    
    result = {
        'format': 'OLE2',
        'size': len(data),
        'readable_strings': [],
        'structure_info': {}
    }
    
    # Extract readable ASCII strings (length >= 4)
    current_string = b''
    for byte in data:
        if 32 <= byte <= 126:  # Printable ASCII
            current_string += bytes([byte])
        else:
            if len(current_string) >= 4:
                try:
                    result['readable_strings'].append(current_string.decode('ascii'))
                except:
                    pass
            current_string = b''
    
    # Add the last string if any
    if len(current_string) >= 4:
        try:
            result['readable_strings'].append(current_string.decode('ascii'))
        except:
            pass
    
    print(f"\nExtracted {len(result['readable_strings'])} readable strings:")
    for s in result['readable_strings'][:20]:  # Show first 20
        print(f"  - {s}")
    
    return result


def parse_raw_binary(f, bin_path: str) -> Dict[str, Any]:
    """Parse raw binary format."""
    f.seek(0)
    data = f.read()
    
    result = {
        'format': 'RAW',
        'size': len(data),
        'readable_strings': [],
        'structure_info': {},
        'binary_analysis': {}
    }
    
    # For small files, try to interpret as structured data
    if len(data) == 8:
        print("\nFile is 8 bytes - likely a pointer/reference structure")
        print("Attempting to parse as little-endian integers:")
        
        # Try different interpretations
        try:
            # As two 32-bit integers (little-endian)
            int1 = struct.unpack('<I', data[0:4])[0]
            int2 = struct.unpack('<I', data[4:8])[0]
            result['binary_analysis']['as_two_uint32'] = (int1, int2)
            print(f"  As two uint32: {int1}, {int2}")
            print(f"  Hex: 0x{int1:08x}, 0x{int2:08x}")
        except:
            pass
        
        try:
            # As one 64-bit integer (little-endian)
            int64 = struct.unpack('<Q', data)[0]
            result['binary_analysis']['as_uint64'] = int64
            print(f"  As uint64: {int64}")
            print(f"  Hex: 0x{int64:016x}")
        except:
            pass
        
        try:
            # As two 16-bit integers + one 32-bit integer
            short1 = struct.unpack('<H', data[0:2])[0]
            short2 = struct.unpack('<H', data[2:4])[0]
            int32 = struct.unpack('<I', data[4:8])[0]
            result['binary_analysis']['as_shorts_and_int'] = (short1, short2, int32)
            print(f"  As two uint16 + uint32: {short1}, {short2}, {int32}")
        except:
            pass
        
        # Check if it might be a file offset or reference
        print("\nPossible interpretations:")
        print("  - Could be a file offset pointer")
        print("  - Could be a shape ID reference")
        print("  - Could be a clipboard format identifier")
    
    # Try to find PowerPoint-specific markers
    # Look for common PowerPoint clipboard format markers
    markers = [
        b'PowerPoint',
        b'Microsoft',
        b'Office',
        b'Shape',
        b'Slide',
        b'Presentation'
    ]
    
    found_markers = []
    for marker in markers:
        if marker in data:
            found_markers.append(marker.decode('ascii'))
            # Find all occurrences
            positions = []
            start = 0
            while True:
                pos = data.find(marker, start)
                if pos == -1:
                    break
                positions.append(pos)
                start = pos + 1
            result['structure_info'][marker.decode('ascii')] = positions
    
    if found_markers:
        print(f"\nFound markers: {found_markers}")
        for marker, positions in result['structure_info'].items():
            print(f"  {marker}: found at positions {positions[:5]}...")  # Show first 5
    
    # Extract readable strings
    current_string = b''
    for byte in data:
        if 32 <= byte <= 126:  # Printable ASCII
            current_string += bytes([byte])
        else:
            if len(current_string) >= 4:
                try:
                    result['readable_strings'].append(current_string.decode('ascii'))
                except:
                    pass
            current_string = b''
    
    if len(current_string) >= 4:
        try:
            result['readable_strings'].append(current_string.decode('ascii'))
        except:
            pass
    
    if result['readable_strings']:
        print(f"\nExtracted {len(result['readable_strings'])} readable strings:")
        for s in result['readable_strings'][:30]:  # Show first 30
            print(f"  - {s}")
    
    return result


def main():
    """Main function to analyze the files."""
    # Get the directory of this script
    script_dir = Path(__file__).parent
    
    # Paths
    bin_path = script_dir / "clipboard_0_com_microsoft_PowerPoint-12_0-Internal-Shapes.bin"
    slide_xml_path = script_dir / "slide7.xml"
    
    print("=" * 80)
    print("PowerPoint Content Reference Analyzer")
    print("=" * 80)
    
    # Parse slide7.xml
    slide_refs = parse_slide_xml(str(slide_xml_path))
    
    # Parse clipboard binary
    clipboard_data = parse_clipboard_binary(str(bin_path))
    
    # Cross-reference analysis
    print("\n" + "=" * 80)
    print("CROSS-REFERENCE ANALYSIS")
    print("=" * 80)
    
    print("\nContent referenced in slide7.xml:")
    print(f"  - Images: {len(slide_refs['images'])}")
    for img in slide_refs['images']:
        print(f"    * {img['target']} (rId: {img['embed_id']})")
    
    print(f"\n  - Text content: {len(slide_refs['text_content'])} shapes")
    for text in slide_refs['text_content'][:5]:  # Show first 5
        print(f"    * {text['name']}: {text['text'][:60]}...")
    
    print(f"\n  - Relationships: {len(slide_refs['relationships'])}")
    for rel in slide_refs['relationships']:
        print(f"    * {rel['id']}: {rel['type']} -> {rel['target']}")
    
    print("\n\nClipboard binary file analysis:")
    print(f"  - Format: {clipboard_data.get('format', 'Unknown')}")
    print(f"  - Size: {clipboard_data.get('size', 0)} bytes")
    
    # Show binary analysis if available
    if 'binary_analysis' in clipboard_data:
        print("\n  Binary structure analysis:")
        for key, value in clipboard_data['binary_analysis'].items():
            print(f"    {key}: {value}")
    
    # Check if clipboard contains references to slide7 content
    if 'readable_strings' in clipboard_data:
        print(f"\n  - Contains {len(clipboard_data['readable_strings'])} readable strings")
        
        # Check for matches with slide7 content
        slide_texts = [t['text'].lower() for t in slide_refs['text_content']]
        clipboard_strings = [s.lower() for s in clipboard_data['readable_strings']]
        
        matches = []
        for slide_text in slide_texts:
            words = slide_text.split()[:5]  # First 5 words
            for word in words:
                if len(word) > 3:  # Only check words longer than 3 chars
                    for clip_str in clipboard_strings:
                        if word in clip_str:
                            matches.append(word)
                            break
        
        if matches:
            print(f"\n  - Found potential matches with slide7 content:")
            for match in set(matches)[:10]:  # Show first 10 unique matches
                print(f"    * '{match}'")
    
    print("\n" + "=" * 80)
    print("Analysis complete!")
    print("=" * 80)


if __name__ == "__main__":
    main()

