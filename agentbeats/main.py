"""CLI entry point for agentbeats PowerPoint benchmark demo."""

import typer
import asyncio
import os

from src.green_agent import start_green_agent
from src.white_agent import start_white_agent
from src.launcher import launch_evaluation, launch_remote_evaluation
from pydantic_settings import BaseSettings


class AgentbeatsSettings(BaseSettings):
    role: str = "unspecified"
    host: str = "127.0.0.1"
    agent_port: int = 9000


app = typer.Typer(help="AgentBeats PowerPoint benchmark runner (A2A green/white)")


@app.command()
def green():
    """Start the green agent (assessment manager)."""
    # Default to PowerPoint benchmark green agent
    start_green_agent(agent_name="ppt_green_agent")


@app.command()
def white():
    """Start the white agent (target being tested)."""
    # Default to PowerPoint benchmark white agent
    start_white_agent(agent_name="ppt_white_agent")


@app.command()
def run():
    settings = AgentbeatsSettings()
    if settings.role == "green":
        # Controller mode: start PPT green agent by default
        start_green_agent(
            agent_name=os.getenv("AGENT_NAME", "ppt_green_agent"),
            host=settings.host,
            port=settings.agent_port,
        )
    elif settings.role == "white":
        start_white_agent(
            agent_name=os.getenv("AGENT_NAME", "ppt_white_agent"),
            host=settings.host,
            port=settings.agent_port,
        )
    else:
        raise ValueError(f"Unknown role: {settings.role}")
    return


@app.command()
def launch():
    """Launch the complete evaluation workflow."""
    asyncio.run(launch_evaluation())


@app.command()
def launch_remote(green_url: str, white_url: str):
    """Launch the complete evaluation workflow."""
    asyncio.run(launch_remote_evaluation(green_url, white_url))


if __name__ == "__main__":
    app()
