FROM postgres

RUN apk --update &&  rm -rf /var/cache/apk/* 

# COPY torrc /etc/tor/torrc

# RUN sed "1s/^/SocksPort 0.0.0.0:9050\n/" /etc/tor/torrc.sample > /etc/tor/torrc \
#     &&  sed -i "s|#%include /etc/torrc.d/\*.conf|%include /etc/torrc.d/\*.conf|g" /etc/tor/torrc \
#     &&  mkdir -p /etc/torrc.d

# VOLUME ["/etc/torrc.d"]
# VOLUME ["/var/lib/tor"]

# ADD docker-entrypoint.sh /docker-entrypoint.sh

# RUN rc-update add tor boot

WORKDIR /postgres
