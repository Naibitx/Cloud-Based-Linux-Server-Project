#!/bin/bash

#Function simulates CPU load/stress 
cpu_stress() 
{
    echo "Stressing the CPU"
    stress-ng -- cpu 4 -- timeout 60s
}
#Function simulates IO load/stress 
io_stress()
{
    echo "Stressing the IO"
    stress-ng -- io 2 -- timeout 60s
}
#Function simulates Hard Disk load/stress 
filesystem_stress()
{
    echo "Stressing the Hard Disk"
    stress-ng -- hdd 2 -- timeout 60s
}
#Function simulates Virtual Memory load/stress 
memory_stress()
{
    echo "Stressing the Virtual Memory"
    stress-ng -- vm 2 -- timeout 60s
}
#Function simulates OS load/stress 
os_stress()
{
    echo "Stressing the OS Scheduler "
    stress-ng -- sched 2 -- timeout 60s
}

#Loop for continious stress testing
while true; do
    cpu_stress
    sleep 10 #Pause before each test

    io_stress
    sleep 10

    filesystem_stress
    sleep 10

    memory_stress
    sleep 10

    os_stress
    sleep 10
done