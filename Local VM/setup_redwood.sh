#!/usr/bin/env bash
# requires a newish ubuntu box

echo "==================================================================="
echo "Updating Package Lists"
echo "==================================================================="
apt-get update
echo "==================================================================="
echo "Installing git"
echo "==================================================================="
apt-get install -y git
echo "==================================================================="
echo "Installing apache2"
echo "==================================================================="
apt-get install -y apache2

# Make apache run as user/group vagrant/vagrant instead of www-data/www-data
# to make development easier
echo "==================================================================="
echo "Changing apache user from www-data to vagrant"
echo "==================================================================="
cd /etc/apache2
sed "s/www-data/vagrant/" envvars > temp
mv temp envvars

# Setup /var/www to point to vagrant synced folder
echo "==================================================================="
echo "Setting up shared folder"
echo "==================================================================="
rm -rf /var/www
ln -fs /vagrant /var/www

# fetch and install Redwood 2!
echo "==================================================================="
echo "Cloning RedwoodFramework git repository"
echo "==================================================================="
cd /var/www
git clone https://github.com/LeepsLab/RedwoodFramework.git -b master redwood

# run setup
echo "==================================================================="
echo "running Redwood 2 Ubuntu+Apache setup script"
echo "==================================================================="
yes | /var/www/redwood/install/ubuntu/apache/setup.sh

# create superuser admin
cd redwood
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin')" | python manage.py shell | no
#
echo "==================================================================="
echo "Redwood 2 VM Setup complete!"
echo "==================================================================="
echo "The Django administration credentials are user: 'admin', pass: 'admin'"