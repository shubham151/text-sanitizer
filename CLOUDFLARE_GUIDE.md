# Cloudflare Tunnel Setup Guide

When you are adding a new application to your server and want to expose it via a Cloudflare Tunnel using `cloudflared`, there are **three critical steps** you must follow. 

If you skip the DNS or the `/etc/` config step, your site will not work!

## Step 1: Update Your Config File
Add your new domain and the local port it runs on to your local config file:
```bash
nano ~/.cloudflared/config.yml
```

Add your new ingress rule above the `404` catch-all:
```yaml
ingress:
  - hostname: sanitize.oneforalllabs.com
    service: http://localhost:3000
  
  # KEEP THIS AT THE VERY BOTTOM
  - service: http_status:404
```

## Step 2: Sync Config to System Service
When running as a background service on Linux, `cloudflared` uses the config file located in `/etc/cloudflared/`, **not** the one in your home directory. 

You must copy your changes over and restart the service so it loads the new rules:
```bash
sudo cp ~/.cloudflared/config.yml /etc/cloudflared/config.yml
sudo systemctl restart cloudflared
```

## Step 3: Create the DNS Record (Crucial)
Your config file tells the tunnel how to handle the traffic, but Cloudflare's DNS still needs to know to send that domain's traffic to your tunnel. 

Run this command to officially create the CNAME record in your Cloudflare dashboard (replace `TUNNEL_ID` with your actual UUID, which is `33317265-e873-49e5-84ef-bdcbd6724d1d` for this server):
```bash
cloudflared tunnel route dns TUNNEL_ID your.newdomain.com
```

### Example:
```bash
cloudflared tunnel route dns 33317265-e873-49e5-84ef-bdcbd6724d1d sanitize.oneforalllabs.com
```

Once all three steps are complete, your new domain will instantly resolve and securely route traffic to your local Docker container!
