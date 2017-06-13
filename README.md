# React Template

> A template with react + redux + react-router4 + webpack2

## Requirements
- node `^4.5.0`
- npm `^3.0.0` or yarn `^0.23.0`

## Installation
```bash
$ git clone https://github.com/gcfeng/react-template.git <my-project-name> 
$ cd <my-project-name>
```

When that's done, install the project dependencies. It's recommended that you use [Yarn](#https://yarnpkg.com/) for 
deterministic dependency management, but `npm install` will suffice.

```bash
$ yarn # or use `npm install`
```

If `npm install` is slowly, you can use npm mirror
```bash
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install
```

## Running the project
After completing the [installation](#installation) step, you are ready to start the project!
```bash
$ yarn start # Start the development server (or `npm start`)
```

All available commands:

| `yarn <script>` or `npm run <script>` | Description |
|---------------------------------------|-------------|
| `start` | start dev server, default listen to 8080, support HRM |
| `start:prod` | start dev server serve files after build |
| `build:prod` | build project and output to `dist/` |
