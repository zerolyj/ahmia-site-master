sed -i "s/localhost/$(hostname)/g" /etc/sysconfig/network
echo $(ip addr show eth0|awk '/inet /{print $2}'| awk -F '/' '{print $1}') $(hostname) >> /etc/hosts

cat << 'EOF' > /etc/yum.repos.d/tor.repo
[tor]
name=Tor experimental repo
enabled=1
baseurl=http://deb.torproject.org/torproject.org/rpm/el/6//$basearch/
gpgcheck=1
gpgkey=http://deb.torproject.org/torproject.org/rpm/RPM-GPG-KEY-torproject.org.asc

[tor-source]
name=Tor experimental source repo
enabled=1
autorefresh=0
baseurl=http://deb.torproject.org/torproject.org/rpm/el/6//SRPMS
gpgcheck=1
gpgkey=http://deb.torproject.org/torproject.org/rpm/RPM-GPG-KEY-torproject.org.asc
EOF

yum -y install tor

echo "Configure the Tor Router"
wget https://www.ahmia.fi/IP/ -O IP.txt
wget https://www.ahmia.fi/static/node/our_exit_policy -O /etc/tor/torrc
wget https://www.ahmia.fi/static/node/tor-exit-notice.html -O /etc/tor/tor-exit-notice.html
sed -i "s,ahmiaTorNode1,ahmiaTOR$(hostname),g" /etc/tor/torrc
sed -i "s,SET_IP_ADDRESS_HERE,$( cat IP.txt ),g" /etc/tor/torrc

restorecon -FvvR /etc/tor

wget 'http://www.issihosts.com/haveged/haveged-1.7.tar.gz'
tar xzf haveged-1.7.tar.gz
cd haveged-1.7
./configure --prefix=/opt/$(basename $(pwd))
make
make install
/opt/haveged-1.7/sbin/haveged -w 3064
sed -i 's,exit 0,/opt/haveged-1.7/sbin/haveged -w 3064,g' /etc/rc.local
echo 'exit 0' >> /etc/rc.local
yum -y install bind
echo -e 'search ovh.com\nnameserver 127.0.0.1' > /etc/resolv.conf
service tor restart
