# L11V3SPA
Base repository with Laravel 11 as server and Vuetify 3 as SPA client. Also contains DockerFile to create a container that runs Apache, PHP, XDebug and other necessary tools for local development and debugging. On the server-side, Sanctum is used for cookie-based authentication. On the client-side, axios keeps track
of managing the cookie and refreshing it automatically.

# How to use
1. Create a detached copy of the repository and download it to your host machine. There are two ways:
   * Cloning this repo, then change its remote to a new repo of your own.
   * Use GitHub Import feature to create a detached copy and then clone it to your host machine.
2. Make sure you have Docker installed on your machine. If you're using Visual Studio Code, it is nice to have Docker extension installed.
3. Open detached cloned repo in VSCode.
4. Duplicate `/docker/.env.example` file and name the new file `.env`. Open it in the editor and update Docker variables such as the port number you want your Laravel server to run on.
5. Open `docker-compose.yml` and set the image name (on line 2) to whatever you want.
6. Open Terminal and go to `docker` subfolder.
7. Run `docker compose build` to create image.
8.  Run `docker compose up` to create and run a container from the image. If you see an error message saying `Invalid Option: set -`, make sure the file `docker-entrypoint.sh` is using `LF` (and not `CRLF`) as line terminator. VSCode sometimes changes this automatically.
9.  Two certificate files (`.crt`) will be generated and copied to `docker` folder (one for Laravel server and one for Vite Server) on the HOST MACHINE. Install them on **Host** machine in `Trusted Root Certification Authorities` folder. You can do it by right-clicking the certificate file and choosing `Install Certificate` command from the menu, or you can run the following command (requires Admin) for each CRT file:
    1.  PowerShell: `Import-Certificate -FilePath "<CRT File Path Here>" -CertStoreLocation Cert:\LocalMachine\Root`
    2.  CMD: `certutil -addstore "Root" "<CRT File Path Here>"`
    3.  In case you want to replace an existing certificate with the new one: run this first: `certutil -delstore "Root" "<common_name>"`
    4.  Note: These certificates can sometimes take 30+ minutes to be recognized by the browser. You'll see INVALID_AUTHORITY or other similar errors in the browser if you try to access the servers during that time. This might be related to hwo SSL certificates are cached. I haven't found a fix for this problem yet. Closing all tabs of the browser has occasionally fixed the problem.
10. Add your local domain name to `%windir%\System32\drivers\etc\hosts` file.
11. Open your server-domain in the browser and make sure the browser does not complain about the certificate. Note that sometimes it can take considerable time for the certificates to be validated by the browser. Clearing browser cache may help in those cases. I'm currently looking into this issue.
12. From Docker extension in VSCode, right-click your running container and choose `Attach Visual Studio Code` command to work directly with the container source. This will save your Host machine from getting polluted with `node_modules` and `vendor` folders.
13. `launch.json` already contains debugging configuration for both Laravel server and Vite client, plus Browser launching. You can simply select `Compound` configuration to launch all of them. Breakpoints will work in Vue components as well as PHP code.
14. `client` folder contains a collection of REST request definitions and an environment definition. If you have installed Thunder Client extension inside the container-attached VSCode, you can import these two files and then use them for quick API testing. You'll need to set collection's Environment setting to the import environment and save the collection before running a request. Also make sure you run `CSRF-cookie` request before making `Login` request to get the required Sanctum cookies.