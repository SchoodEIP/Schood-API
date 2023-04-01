# NodeJS API CI/CD template

A Node.JS template for a simple API featuring CI/CD features

You can create a repository from this template, modifying after it some files to make sure it's working like intended.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. You can rename the .env.template to .env and modify it's values for your own API.

`DB_PORT` example: `DB_PORT=27017`

`EXPRESS_PORT` example: `EXPRESS_PORT=8080` 


## Run Locally

Clone the project

```bash
  git clone git@github.com:Exiels/NodeJS-API-CI-CD-template.git
```

Or use as template : https://github.com/Exiels/NodeJS-API-CI-CD-template/generate

Go to the project directory

```bash
  cd NodeJS-API-CI-CD-template
```

Copy and overwrite/modify all files nedded in the infos folder

Find all [TO_MODIFY] tags to help you modify all necessary informations
```bash
  LICENCE
  README.md
  .env.template => .env
  SECURITY.md
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
```

Remove the infos folder
```bash
  rm -rf infos
```

Init project

```bash
  npm init
```

Install express dependence

```bash
  npm install express
```

Start the server

```bash
  npm run start
```

Or Docker-Compose

```bash
  docker-compose up --build
```


## Deployment

To deploy this project run

Init project

```bash
  npm init
```

Install express dependence

```bash
  npm install express
```

Modify .env with envvars informations

```bash
  docker-compose up --build
```


## Features

- Node.JS Express API
- Continuous Integration with GitHub Actions
- Continuous Development with Dockerfile and Docker-Compose

## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Authors

- [@Exiels](https://www.github.com/Exiels)


## License

[Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode)
