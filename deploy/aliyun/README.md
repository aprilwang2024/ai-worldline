# Aliyun mainland mirror

The mainland mirror at `aiworldline.aprilworks.cn` is a deployment target, not a
second source repository. The canonical source remains the public `main` branch.

The server timer checks the GitHub commit SHA every ten minutes. A changed SHA is
downloaded into a new release directory, validated, and then published by an
atomic symlink switch. A temporary GitHub outage therefore leaves the last known
good release online and is retried on the next timer run.

Server paths:

- updater: `/usr/local/sbin/update-ai-worldline`
- releases: `/var/www/aiworldline.aprilworks.cn/releases`
- live symlink: `/var/www/aiworldline.aprilworks.cn/current`
- systemd units: `ai-worldline-update.service` and `.timer`
- Nginx host: `/etc/nginx/conf.d/aiworldline.aprilworks.cn.conf`
- Certbot deploy hook: `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx`

After changing one of these files, copy it to the matching server path and run:

```sh
systemctl daemon-reload
systemctl restart ai-worldline-update.service
nginx -t
systemctl reload nginx
```

TLS is provisioned separately with Certbot for `aiworldline.aprilworks.cn`; the
existing `aprilworks.cn` certificate does not include this subdomain. The HTTP
virtual host keeps the ACME challenge path available and redirects other traffic
to HTTPS.
