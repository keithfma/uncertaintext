#!/usr/bin/env python
"""Uncertaintext python prototype

Exploring the basic idea of representing uncertain values with samples from the
underlying distribution
"""

import click
from random import gauss
import time


@click.command()
@click.option('--mu', type=float, default=0., help='Mean, parameter to gaussian distribution')
@click.option('--sigma', type=float, default=1., help='Standard deviation, parameter to gaussian distribution')
@click.option('--fps', type=int, default=10, help='Target update rate, in "frames per second"')
@click.option('--duration', type=float, default=5, help='Demo duration in seconds')
def cli(mu: float, sigma: float, fps: int, duration: float):
    """Display uncertaintext representation of the specified distribution
    """
    delay = 1. / fps
    exit_time  = time.monotonic() + duration
    base = f'{mu:.2f} \u00B1 {2*sigma:.2f}'

    while (now := time.monotonic()) < exit_time:
        click.echo(f'{base} ({gauss(mu, sigma): .2f})\r', nl=False)
        time.sleep(max(0, (now + delay) - time.monotonic()))
    click.echo()
        

if __name__ == '__main__':
    cli()
