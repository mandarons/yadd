FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"
RUN \
    apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    software-properties-common git default-jre ca-certificates && \
    apt-get clean &&\
    rm -rf /var/lib/apt/lists/*
RUN \
    wget https://repo.maven.apache.org/maven2/io/qameta/allure/allure-commandline/2.20.1/allure-commandline-2.20.1.zip && \
    unzip allure-commandline-2.20.1.zip -d /allure && \
    rm allure-commandline-2.20.1.zip

ENV PATH "/allure/allure-2.20.1/bin:${PATH}"
USER node
RUN npx playwright install --with-deps