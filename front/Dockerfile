FROM node:18.12.1-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Avoid crashing when the internet connection is slow
RUN npm config set timeout 6000000

# Install dependencies only first
COPY ./react/package.json ./
RUN npm install

# Install the rest
COPY ./react ./
RUN npm install
Run npm run build

CMD ["npm", "start"]
