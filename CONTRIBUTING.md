# CONTRIBUTING

---  

## Initial Setup

After you've cloned the repository to your local machine or codespace, you'll
need to perform some initial setup steps before you can develop on the action.

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy (20.x or later should work!). If you are
> using a version manager like [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), this repository has a `.node-version`
> file at the root of the repository that will be used to automatically switch
> to the correct version when you `cd` into the repository. Additionally, this
> `.node-version` file is used by GitHub Actions in any `actions/setup-node`
> actions.

1. :hammer_and_wrench: Install the dependencies

   ```bash
   npm install
   ```

2. :building_construction: Package the TypeScript for distribution

   ```bash
   npm run build
   ```

3. :white_check_mark: Run the tests

   ```bash
   $ npm test

   > google-chat-notification@1.0.0 test
   > jest
   
   PASS  __tests__/main.test.ts
   ✓ test (2 ms)
   
   Test Suites: 1 passed, 1 total
   Tests:       1 passed, 1 total
   Snapshots:   0 total
   Time:        1.476 s, estimated 2 s
   Ran all test suites.
   ```

## Developing the Action

1. Create a new branch

   ```bash
   git checkout -b feature/my-feature-title
   ```

2. Replace the contents of `src/` with your action code
3. Add tests to `__tests__/` for your source code
4. Format, test, and build the action

   ```bash
   npm run all
   ```

   > [!WARNING]
   >
   > This step is important! It will run [`ncc`](https://github.com/vercel/ncc)
   > to build the final JavaScript action code with all dependencies included.
   > If you do not run this step, your action will not work correctly when it is
   > used in a workflow. This step also includes the `--license` option for
   > `ncc`, which will create a license file for all the production node
   > modules used in your project.

5. Commit your changes

   ```bash
   git add .
   git commit -m "My first feature is ready!"
   ```

6. Push them to your repository

   ```bash
   git push -u origin feature/my-feature-title
   ```

7. Create a pull request and get feedback on your action
8. Merge the pull request into the `main` branch

Your action is now published! :Rocket:


## Validate the Action

You can now validate the action by referencing it in a workflow file and making sure everything works fine. For
example:

```yaml
name: Send Google chat notification
run-name: Send Google chat notification

on:
   workflow_dispatch:


jobs:
   notify:
      runs-on: ubuntu-latest
      steps:
         - name: Google Chat Notification
           uses: Youcef00/google-chat-notification@feature/my-feature-title
           with:
              name: Test
              url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
              status: ${{ job.status }}
```

## Submitting your contribution

After testing, you can create a pull request and add me (@Youcef00) as a reviewer. 

Please detail int the PR description the changes you made and why.

Once the PR is approved, I will merge it into the main branch and create a release.