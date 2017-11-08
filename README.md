Riot
====

Riot (formerly known as Vector) is a Matrix web client built using the Matrix
React SDK (https://github.com/matrix-org/matrix-react-sdk).

Getting Started
===============

The easiest way to test Riot is to just use the hosted copy at
https://riot.im/app.  The develop branch is continuously deployed by Jenkins at
https://riot.im/develop for those who like living dangerously.

To host your own copy of Riot, the quickest bet is to use a pre-built
released version of Riot:

1. Download the latest version from https://github.com/vector-im/riot-web/releases
1. Untar the tarball on your web server
1. Move (or symlink) the vector-x.x.x directory to an appropriate name
1. If desired, copy `config.sample.json` to `config.json` and edit it
   as desired. See below for details.
1. Enter the URL into your browser and log into Riot!

Releases are signed by PGP, and can be checked against the public key
at https://riot.im/packages/keys/riot.asc

Note that Chrome does not allow microphone or webcam access for sites served
over http (except localhost), so for working VoIP you will need to serve Riot
over https.

### Installation Steps for Debian Stretch
1. Add the repository to your sources.list using either of the following two options:
  - Directly to sources.list: `echo "deb https://riot.im/packages/debian/ stretch main" | sudo tee -a /etc/apt/sources.list`
  - As a separate entry in sources.list.d: `echo "deb https://riot.im/packages/debian/ stretch main" | sudo tee /etc/apt/sources.list.d/riot.list`
2. Add the gpg signing key for the riot repository: `curl -s https://riot.im/packages/debian/repo-key.asc | sudo apt-key add -`
3. Update your package lists: `sudo apt-get update`
4. Install Riot: `sudo apt-get install riot-web`

Important Security Note
=======================

We do not recommend running Riot from the same domain name as your Matrix
homeserver.  The reason is the risk of XSS (cross-site-scripting)
vulnerabilities that could occur if someone caused Riot to load and render
malicious user generated content from a Matrix API which then had trusted
access to Riot (or other apps) due to sharing the same domain.

We have put some coarse mitigations into place to try to protect against this
situation, but it's still not good practice to do it in the first place.  See
https://github.com/vector-im/riot-web/issues/1977 for more details.

Building From Source
====================

Riot is a modular webapp built with modern ES6 and requires a npm build system
to build.

1. Install or update `node.js` so that your `node` is at least v6.3.0 (and `npm`
   is at least v3.10.x).
1. Clone the repo: `git clone https://github.com/vector-im/riot-web.git`.
1. Switch to the riot-web directory: `cd riot-web`.
1. If you're using the `develop` branch, install the develop versions of the
   dependencies, as the released ones will be too old:
   ```
   scripts/fetch-develop.deps.sh
   ```
   Whenever you git pull on riot-web you will also probably need to force an update
   to these dependencies - the simplest way is to re-run the script, but you can also
   manually update and rebuild them:
   ```
   cd matrix-js-sdk
   git pull
   npm install # re-run to pull in any new dependencies
   # Depending on your version of npm, npm run build may happen as part of
   # the npm install above (https://docs.npmjs.com/misc/scripts#prepublish-and-prepare)
   # If in doubt, run it anyway:
   npm run build
   cd ../matrix-react-sdk
   git pull
   npm install
   npm run build
   ```
   However, we recommend setting up a proper development environment (see "Setting
   up a dev environment" below) if you want to run your own copy of the
   `develop` branch, as it makes it much easier to keep these dependencies
   up-to-date.  Or just use https://riot.im/develop - the continuous integration
   release of the develop branch.
   (Note that we don't reference the develop versions in git directly due to
   https://github.com/npm/npm/issues/3055.)
1. Install the prerequisites: `npm install`.
1. Configure the app by copying `config.sample.json` to `config.json` and
   modifying it (see below for details).
1. `npm run dist` to build a tarball to deploy. Untaring this file will give
   a version-specific directory containing all the files that need to go on your
   web server.

Note that `npm run dist` is not supported on Windows, so Windows users can run `npm
run build`, which will build all the necessary files into the `webapp`
directory. The version of Riot will not appear in Settings without
using the dist script. You can then mount the `webapp` directory on your
webserver to actually serve up the app, which is entirely static content.

config.json
===========

You can configure the app by copying `config.sample.json` to
`config.json` and customising it:

1. `default_hs_url` is the default home server url.
1. `default_is_url` is the default identity server url (this is the server used
   for verifying third party identifiers like email addresses). If this is blank,
   registering with an email address, adding an email address to your account,
   or inviting users via email address will not work.  Matrix identity servers are
   very simple web services which map third party identifiers (currently only email
   addresses) to matrix IDs: see http://matrix.org/docs/spec/identity_service/unstable.html
   for more details.  Currently the only public matrix identity servers are https://matrix.org
   and https://vector.im.  In future identity servers will be decentralised.
1. `integrations_ui_url`: URL to the web interface for the integrations server.
1. `integrations_rest_url`: URL to the REST interface for the integrations server.
1. `roomDirectory`: config for the public room directory. This section is optional.
1. `roomDirectory.servers`: List of other Home Servers' directories to include in the drop
   down list. Optional.
1. `update_base_url` (electron app only): HTTPS URL to a web server to download
   updates from. This should be the path to the directory containing `macos`
   and `win32` (for update packages, not installer packages).
1. `cross_origin_renderer_url`: URL to a static HTML page hosting code to help display
   encrypted file attachments. This MUST be hosted on a completely separate domain to
   anything else since it is used to isolate the privileges of file attachments to this
   domain. Default: `usercontent.riot.im`. This needs to contain v1.html from
   https://github.com/matrix-org/usercontent/blob/master/v1.html

Running as a Desktop app
========================

Riot can also be run as a desktop app, wrapped in electron. You can download a
pre-built version from https://riot.im/desktop.html or, if you prefer,
build it yourself. Requires Electron >=1.6.0

To run as a desktop app:

1. Follow the instructions in 'Building From Source' above, but run
   `npm run build` instead of `npm run dist` (since we don't need the tarball).
2. Install electron and run it:

   ```
   npm install electron
   npm run electron
   ```

To build packages, use electron-builder. This is configured to output:
 * dmg + zip for macOS
 * exe + nupkg for Windows
 * deb for Linux
But this can be customised by editing the `build` section of package.json
as per https://github.com/electron-userland/electron-builder/wiki/Options

See https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build
for dependencies required for building packages for various platforms.

The only platform that can build packages for all three platforms is macOS:
```
brew install wine --without-x11
brew install mono
brew install gnu-tar
npm install
npm run build:electron
```

For other packages, use electron-builder manually. For example, to build a package
for 64 bit Linux:

 1. Follow the instructions in 'Building From Source' above
 2. `node_modules/.bin/build -l --x64`

All electron packages go into `electron/dist/`

Many thanks to @aviraldg for the initial work on the electron integration.

Other options for running as a desktop app:
 * https://github.com/krisak/vector-electron-desktop
 * @asdf:matrix.org points out that you can use nativefier and it just works(tm)

```
sudo npm install nativefier -g
nativefier https://riot.im/app/
```

Development
===========

Before attempting to develop on Riot you **must** read the developer guide
for `matrix-react-sdk` at https://github.com/matrix-org/matrix-react-sdk, which
also defines the design, architecture and style for Riot too.

The idea of Riot is to be a relatively lightweight "skin" of customisations on
top of the underlying `matrix-react-sdk`. `matrix-react-sdk` provides both the
higher and lower level React components useful for building Matrix communication
apps using React.

After creating a new component you must run `npm run reskindex` to regenerate
the `component-index.js` for the app (used in future for skinning)

**However, as of July 2016 this layering abstraction is broken due to rapid
development on Riot forcing `matrix-react-sdk` to move fast at the expense of
maintaining a clear abstraction between the two.**  Hacking on Riot inevitably
means hacking equally on `matrix-react-sdk`, and there are bits of
`matrix-react-sdk` behaviour incorrectly residing in the `riot-web` project
(e.g. matrix-react-sdk specific CSS), and a bunch of Riot specific behaviour
in the `matrix-react-sdk` (grep for `vector` / `riot`).  This separation problem will be
solved asap once development on Riot (and thus matrix-react-sdk) has
stabilised.  Until then, the two projects should basically be considered as a
single unit.  In particular, `matrix-react-sdk` issues are currently filed
against `riot-web` in github.

Please note that Riot is intended to run correctly without access to the public
internet.  So please don't depend on resources (JS libs, CSS, images, fonts)
hosted by external CDNs or servers but instead please package all dependencies
into Riot itself.

Setting up a dev environment
============================

Much of the functionality in Riot is actually in the `matrix-react-sdk` and
`matrix-js-sdk` modules. It is possible to set these up in a way that makes it
easy to track the `develop` branches in git and to make local changes without
having to manually rebuild each time.

First clone and build `matrix-js-sdk`:

1. `git clone git@github.com:matrix-org/matrix-js-sdk.git`
1. `pushd matrix-js-sdk`
1. `git checkout develop`
1. `npm install`
1. `npm install source-map-loader` # because webpack is made of fail (https://github.com/webpack/webpack/issues/1472)
1. `popd`

Then similarly with `matrix-react-sdk`:

1. `git clone git@github.com:matrix-org/matrix-react-sdk.git`
1. `pushd matrix-react-sdk`
1. `git checkout develop`
1. `npm install`
1. `rm -r node_modules/matrix-js-sdk; ln -s ../../matrix-js-sdk node_modules/`
1. `popd`

Finally, build and start Riot itself:

1. `git clone git@github.com:vector-im/riot-web.git`
1. `cd riot-web`
1. `git checkout develop`
1. `npm install`
1. `rm -r node_modules/matrix-js-sdk; ln -s ../../matrix-js-sdk node_modules/`
1. `rm -r node_modules/matrix-react-sdk; ln -s ../../matrix-react-sdk node_modules/`
1. `npm start`
1. Wait a few seconds for the initial build to finish; you should see something like:
    ```
    Hash: b0af76309dd56d7275c8
    Version: webpack 1.12.14
    Time: 14533ms
             Asset     Size  Chunks             Chunk Names
         bundle.js   4.2 MB       0  [emitted]  main
        bundle.css  91.5 kB       0  [emitted]  main
     bundle.js.map  5.29 MB       0  [emitted]  main
    bundle.css.map   116 kB       0  [emitted]  main
        + 1013 hidden modules
    ```
   Remember, the command will not terminate since it runs the web server
   and rebuilds source files when they change. This development server also
   disables caching, so do NOT use it in production.
1. Open http://127.0.0.1:8080/ in your browser to see your newly built Riot.

When you make changes to `matrix-react-sdk` or `matrix-js-sdk`, you will need
to run `npm run build` in the relevant directory. You can do this automatically
by instead running `npm start` in the directory, to start a development builder
which will watch for changes to the files and rebuild automatically.

If you add or remove any components from the Riot skin, you will need to rebuild
the skin's index by running, `npm run reskindex`.

If any of these steps error with, `file table overflow`, you are probably on a mac
which has a very low limit on max open files. Run `ulimit -Sn 1024` and try again.
You'll need to do this in each new terminal you open before building Riot.

Running the tests
-----------------

There are a number of application-level tests in the `tests` directory; these
are designed to run in a browser instance under the control of
[karma](https://karma-runner.github.io). To run them:

* Make sure you have Chrome installed (a recent version, like 59)
* Make sure you have `matrix-js-sdk` and `matrix-react-sdk` installed and
  built, as above
* `npm run test`

The above will run the tests under Chrome in a `headless` mode.

You can also tell karma to run the tests in a loop (every time the source
changes), in an instance of Chrome on your desktop, with `npm run
test-multi`. This also gives you the option of running the tests in 'debug'
mode, which is useful for stepping through the tests in the developer tools.

Translations
============

To add a new translation, head to the [translating doc](docs/translating.md).

For a developer guide, see the [translating dev doc](docs/translating-dev.md).

[<img src="https://translate.riot.im/widgets/riot-web/-/multi-auto.svg" alt="translationsstatus" width="340">](https://translate.riot.im/engage/riot-web/?utm_source=widget)

Triaging issues
===============

Issues will be triaged by the core team using the following primary set of tags:

priority:

* P1: top priority; typically blocks releases
* P2: still need to fix, but lower than P1
* P3: non-urgent
* P4: intereseting idea - bluesky some day
* P5: recorded for posterity/to avoid duplicates. No intention to resolves right now.

bug or feature:

* bug
* feature

bug severity:

* cosmetic - feature works functionally but UI/UX is broken
* critical - whole app doesn't work
* major - entire feature doesn't work
* minor - partially broken feature (but still usable)

additional categories:

* release blocker
* ui/ux (think of this as cosmetic)
* network (specific to network conditions)
* platform (platform specific)
