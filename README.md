# BETWIN NODEJS API PROJECT

# Start the app in production with pm2
```pm2 start app.js --name "betwin-backend"
```

Open an SSH client.

Locate your private key file. The key used to launch this instance is betwin-app.pem

Run this command, if necessary, to ensure your key is not publicly viewable.
 chmod 400 betwin-app.pem

Connect to your instance using its Public DNS:
 ec2-54-211-175-190.compute-1.amazonaws.com

Example:

 ssh -i "betwin-app.pem" ubuntu@ec2-54-211-175-190.compute-1.amazonaws.com