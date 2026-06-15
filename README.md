This is a Next.js app meant that pulls APIs you've set up yourself on it.

These are just instructions to run it yourself assuming you've met the prerequisites.
The files on this GitHub are only meant to run the website, things like the APIs will be needed to be set up by yourself.

Prerequisites:
Node.js
npm
A terminal environment

Azure Services required:
Azure Content Safety
Azure SQL Database
Azure Web App Services if you're planning to host it.

Environment Variables:
These are meant to be put into a .env.local file in your root folder where the package.json is.
If you're planning to host on Azure Web App Services, put the environment variables in their own tab there alongside this one below so the program will create a production build on deployment.
SCM_DO_BUILD_DURING_DEPLOYMENT=true

Put all of the requested variables after each corresponding "="
# Azure AI Content Safety API Configuration
AZURE_CONTENT_SAFETY_ENDPOINT=
AZURE_CONTENT_SAFETY_KEY=

# Azure SQL Database Configuration
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_DATABASE=

Locally Running Assuming the files are installed and your terminal is navigated to it.
1. Run "npm install"

2. Run "npm run dev"

3. Navigate to http://localhost:3000

Hosting is automated through Azure Web App Services and GitHub Actions where commits are pushed automatically after hooking up the environment variables and linking a workflow to it.

Limitations:
This program will only BLOCK inappropriate comments from being sent. This will not actually do anything to the users such as giving warnings, banning others, or moderating their accounts in any way.
It simply will give you a popup that the comment was bad, explain what's wrong with it, save the comment, and not post it to the website.
