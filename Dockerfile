FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg2 \
    ca-certificates \
    lsb-release \
    software-properties-common \
    sudo \
    systemctl \
    && rm -rf /var/lib/apt/lists/*

# Copy Vesta source
COPY . /opt/vesta-src

WORKDIR /opt/vesta-src

# Expose Vesta ports
EXPOSE 8083 80 443

# Default command
CMD ["/bin/bash"]
