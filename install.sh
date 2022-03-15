 #!/bin/bash

    dpkg -s docker-ce docker-ce-cli containerd.io &> /dev/null  

    if [ $? -ne 0 ]

        then
             sudo apt-get install \
                ca-certificates \
                curl \
                gnupg \
                lsb-release

             curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
            echo \
            "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

            sudo apt-get update
            sudo apt-get install docker-ce docker-ce-cli containerd.io
    fi

    image=$(sudo docker build . | tail -n1 | grep -oE '[^ ]+$')
    sudo docker run -d --name Buff_Correll --restart always $image