FROM node:18.12.1-bullseye-slim
ENV PATH /nest/node_modules/.bin:$PATH
WORKDIR /nest

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# nc for entrypoint + openssl for prisma + ps for nest
RUN apt-get update \
&& apt-get install -y netcat openssl procps \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Avoid crashing when the internet connection is slow
RUN npm config set timeout 6000000

# Install dependencies only first
COPY ./nest/package.json ./
RUN npm install

# Install the rest
COPY ./nest ./
RUN npm install
RUN npx prisma generate

RUN nest build

ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "run", "start:dev:deploy"]