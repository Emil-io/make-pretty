"""Launcher module - initiates and coordinates the evaluation process."""

import multiprocessing
import json
from src.green_agent.agent import start_green_agent
from src.white_agent.agent import start_white_agent
from src.my_util import my_a2a


async def launch_evaluation():
    # start green agent
    print("Launching green agent (PowerPoint benchmark)...")
    green_address = ("localhost", 9001)
    green_url = f"http://{green_address[0]}:{green_address[1]}"
    p_green = multiprocessing.Process(
        target=start_green_agent, args=("ppt_green_agent", *green_address)
    )
    p_green.start()
    assert await my_a2a.wait_agent_ready(green_url), "Green agent not ready in time"
    print("Green agent is ready (PowerPoint benchmark).")

    # start white agent
    print("Launching white agent (PowerPoint benchmark)...")
    white_address = ("localhost", 9002)
    white_url = f"http://{white_address[0]}:{white_address[1]}"
    p_white = multiprocessing.Process(
        target=start_white_agent, args=("ppt_white_agent", *white_address)
    )
    p_white.start()
    assert await my_a2a.wait_agent_ready(white_url), "White agent not ready in time"
    print("White agent is ready (PowerPoint benchmark).")

    # send the task description
    print("Sending PowerPoint benchmark task to green agent...")
    task_text = f"""
Your task is to run the PowerPoint benchmark against the agent located at:
<white_agent_url>
http://{white_address[0]}:{white_address[1]}/
</white_agent_url>
Use the benchmark API at:
<benchmark_api_url>
http://localhost:5050
</benchmark_api_url>
Run this many random cases:
<num_cases>
10
</num_cases>
Use this white agent id for submissions/results:
<white_agent_id>
agentbeats-white
</white_agent_id>
    """
    print("Task description:")
    print(task_text)
    print("Sending...")
    response = await my_a2a.send_message(green_url, task_text)
    print("Response from green agent:")
    print(response)

    print("PowerPoint benchmark run complete. Terminating agents...")
    p_green.terminate()
    p_green.join()
    p_white.terminate()
    p_white.join()
    print("Agents terminated.")


async def launch_remote_evaluation(green_url: str, white_url: str):
    task_text = f"""
Your task is to run the PowerPoint benchmark against the agent located at:
<white_agent_url>
{white_url}
</white_agent_url>
Use the benchmark API at:
<benchmark_api_url>
http://localhost:5050
</benchmark_api_url>
Run this many random cases:
<num_cases>
10
</num_cases>
Use this white agent id for submissions/results:
<white_agent_id>
agentbeats-white
</white_agent_id>
    """
    print("Sending task description to green agent...")
    response = await my_a2a.send_message(green_url, task_text)
    print("Response from green agent:")
    print(response)
