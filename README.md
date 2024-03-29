# BETWIN NODEJS API PROJECT

# Start the app in production with pm2
```pm2 start app.js --name "betwin-backend"
```

Open an SSH client.

Locate your private key file. The key used to launch this instance is betwin-app.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
 chmod 400 betwin-app.pem

Connect to your instance using its Public DNS:
 ec2-3-93-107-12.compute-1.amazonaws.com

Example:

`ssh -i "betwin-app.pem" ubuntu@ec2-3-93-107-12.compute-1.amazonaws.com`

## Connect to the server via SSH:
`chmod 400 newsboulevard-server-key.pem`
`ssh -i "newsboulevard-server-key.pem" ubuntu@ec2-44-215-246-142.compute-1.amazonaws.com`

## Provision the virtual machine with ansible
```
cd ansible
ansible-playbook -i inventory.ini ec2_provision.yml
```

## Follow the instructions to install github runner

## Start the github runner in daemon
`sudo ./svc.sh install`
`sudo ./svc.sh start`