# Contributing

## Fork and Pull Request Proccess

**1. Create a fork of the project**

**2. Make your changes**

  - You can add yourself to the contributors list in [README.md](../README.md), if you desire.

**3. Create a pull request**

  - When creating a pull request, please make sure that:

    - Your code works
    - You remove all excessive debug helpers
    - You follow this project's naming conventions
    - You follow this project's [structure](ARCHITECTURE.md)
    - You comment your code to explain how it works
    - You make your code easily readable and modifiable
    - You add to the documentation if needed

  - It's also imperative that you:
    - Never commit `config.yaml` or any other configuration to source control. `config.example.yaml` is the only configuration-like file that should be committed, as it is a template for other people to get up and running quickly
    - Don't add dependencies that are not able to be used our current [license (MIT)](../license)
    - Avoid adding dependencies for simple tasks - there's no need to include [`string-reverse`](https://www.npmjs.com/package/string-reverse), just write the code yourself.

## Commit Message Conventions

Good commit message hygiene is extremely important. We follow the structure of

- First line has 50 charecters. It describes what you added or changed
- Second line is empty
- Third line starts the paragraph section
- Paragraph section has 72 charecters per line and explains in detail what you did and why you did it
- Each section can use markdown formatting

## Branch Naming Conventions

We like to follow the branch naming convention of `name-feature`. For example if Ryan Prairie is working on a feature called purge, the branch would look like `ryanp-purge`.

## Code of Conduct

We want to foster an open and welcoming environment. We will answer any questions and issues. As this is a harassment-free environment, not being open to people of any kind will result in a ban.

## Starting an Issue

Need help or want to bring something to our attention? Create an issue. There are multiple kinds but the 3 kinds that we support are bug report, code maintenance, and feature request.

### Labels

We use labels to denote what is going on an issue. You can search by issues or use them as a quick guide to an issue.

some important labels are

- `bug` when something isn't working
- `dependencies` to update the dependencies
- `enhancement` for adding a new feature or functionality
- `help wanted` for asking for help
- `question` for asking a question
- `security` for an issue with security

## Security

We obviously want to know about security issues with our software. If there is a security vulnerability with our software or systems, please contact us before you create a public issue. You can contact us at [css@uwindsor.ca](mailto://css@uwindsor.ca)
