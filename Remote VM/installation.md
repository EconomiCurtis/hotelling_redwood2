login auth: Email address and password were set by the admin.

These are some warnings that I saw while installing Redwood. The first is Django's update, which doesn't seem to matter that much to this project:

```sh
You have installed Django's auth system, and don't have any superusers defined.
Would you like to create one now? (yes/no): yes
System check identified some issues:

WARNINGS:
?: (1_6.W001) Some project unittests may not execute as expected.
        HINT: Django 1.6 introduced a new default test runner. It looks like this project was generated using Django 1.5 or earlier. You should ensure your tests are all running & behaving as expected. See https://docs.djangoproject.com/en/dev/releases/1.6/#new-test-runner for more information.
```

The second was that Bash failed to execute some of these commands:


```sh
# Overwrite old apache configuration file with new one pulled from wiki
cd /etc/apache2/sites-available
cp /var/www/redwood/install/ubuntu/apache/redwood.conf ./redwood.conf
cd /etc/apache2/sites-enabled
ln -s ../sites-available/redwood.conf
rm 000-default.conf
```

and the following is the log:
```sh
292 static files copied to '/var/www/redwood/static'.
ln: failed to create symbolic link ‘./redwood.conf’: File exists
rm: cannot remove ‘000-default.conf’: No such file or directory
 * Stopping web server apache2
 *
 * Starting web server apache2
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 10.230.9.163. Set the 'ServerName' directive globally to suppress this message
 *
redwood-router start/running, process 13903
```

So bash failed to copy the following file:
```sh
/var/www/redwood/install/ubuntu/apache/redwood.conf
```

```conf
<VirtualHost *:80>
    ServerName redwood.example.com
    ServerAdmin admin@example.com

    WSGIScriptAlias / /var/www/redwood/apache/django.wsgi
    Alias /static /var/www/redwood/static
</VirtualHost>
```


Accessed http://10.230.9.163/admin from port 80 and got an internal server error

I stopped the apache2 service and the redwood-router service and restarted them but got the same error. Ill check what the error log has to say. Nothing.

Where should I look next?

`./apache/config.json` empty
`./go/src/websocket/server.go` 
./go/src/websocket/expecon-router