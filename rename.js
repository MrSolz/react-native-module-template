const fs = require('fs')
const readline = require('readline')

// Params used in the template project
const DEFAULT_NAME = 'react-native-module-template'
const DEFAULT_SHORT_NAME = 'ModuleTemplate'
const DEFAULT_URL =
    'https://github.com/MrSolz/react-native-module-template#readme'
const DEFAULT_GIT_URL =
    'https://github.com/MrSolz/react-native-module-template.git'
const DEFAULT_AUTHOR_NAME = 'Thanh Son Dang'
const DEFAULT_AUTHOR_EMAIL = 'sondt.gvn@gmail.com'
const DEFAULT_ANDROID_NAME = 'reactnativemoduletemplate'

// Questions list
const QUESTION_NAME = `Enter library name (use kebab-case) (default ${DEFAULT_NAME}): `
const QUESTION_SHORT_NAME = `Enter library short name (default ${DEFAULT_SHORT_NAME}): `
const QUESTION_URL = `Enter library homepage (default ${DEFAULT_URL}): `
const QUESTION_GIT_URL = `Enter library git url (default ${DEFAULT_GIT_URL}): `
const QUESTION_AUTHOR_NAME = `Enter author name (default ${DEFAULT_AUTHOR_NAME}): `
const QUESTION_AUTHOR_EMAIL = `Enter author email (default ${DEFAULT_AUTHOR_EMAIL}): `

// Pass `js-only` parameter to remove native code
const jsOnly = process.argv.slice(2).includes('js-only')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

if (jsOnly) {
    // JS only mode
    // Remove `QUESTION_SHORT_NAME` since it is used only in the native code
    // Remove `QUESTION_GIT_URL` since in it used only in the .podspec file
    rl.question(QUESTION_NAME, (name) => {
        rl.question(QUESTION_URL, (url) => {
            rl.question(QUESTION_AUTHOR_NAME, (authorName) => {
                rl.question(QUESTION_AUTHOR_EMAIL, (authorEmail) => {
                    renameFiles(
                        name || undefined,
                        undefined,
                        url || undefined,
                        undefined,
                        authorName || undefined,
                        authorEmail || undefined
                    )
                    rl.close()
                })
            })
        })
    })
} else {
    // Normal mode
    // All questions
    rl.question(QUESTION_NAME, (name) => {
        rl.question(QUESTION_SHORT_NAME, (shortName) => {
            rl.question(QUESTION_URL, (url) => {
                rl.question(QUESTION_GIT_URL, (gitUrl) => {
                    rl.question(QUESTION_AUTHOR_NAME, (authorName) => {
                        rl.question(QUESTION_AUTHOR_EMAIL, (authorEmail) => {
                            renameFiles(
                                name || undefined,
                                shortName || undefined,
                                url || undefined,
                                gitUrl || undefined,
                                authorName || undefined,
                                authorEmail || undefined
                            )
                            rl.close()
                        })
                    })
                })
            })
        })
    })
}

const replaceDefaultShortName = (data, shortName) => {
    return data.replace(new RegExp(DEFAULT_SHORT_NAME, 'g'), shortName)
}

const renameFiles = (
    name = DEFAULT_NAME,
    shortName = DEFAULT_SHORT_NAME,
    url = DEFAULT_URL,
    gitUrl = DEFAULT_GIT_URL,
    authorName = DEFAULT_AUTHOR_NAME,
    authorEmail = DEFAULT_AUTHOR_EMAIL,
) => {
    try {
        // Clear `README.md`
        fs.writeFileSync('README.md', '')

        // JS only mode
        // Remove .podspec
        // Modify `package.json`
        const packageData = fs.readFileSync('package.json').toString()
        let newPackageData = packageData
            .replace(DEFAULT_URL, url)
            .replace(new RegExp(DEFAULT_NAME, 'g'), name)
            .replace(DEFAULT_AUTHOR_NAME, authorName)
            .replace(DEFAULT_AUTHOR_EMAIL, authorEmail)
            .replace(/"description": ".+"/g, '"description": ""')
            .replace(/"version": ".+"/g, '"version": "1.0.0"')
        // JS only mode
        // Supply only `lib` folder in `package.json`
        newPackageData = newPackageData.replace(
            /"files": \[.+\],/s,
            '"files": [\n    "lib"\n  ],'
        )
        fs.writeFileSync('package.json', newPackageData)

        // Modify author in `LICENSE`
        const licenseData = fs.readFileSync('LICENSE').toString()
        const newLicenseData = licenseData.replace(DEFAULT_AUTHOR_NAME, authorName)
        fs.writeFileSync('LICENSE', newLicenseData)

        // Modify example's `tsconfig.json`
        // const tsConfigData = fs.readFileSync('example/tsconfig.json').toString()
        // const newTsConfigData = tsConfigData.replace(DEFAULT_NAME, name)
        // fs.writeFileSync('example/tsconfig.json', newTsConfigData)


        // Normal mode
        // Rename native modules in `index.tsx`
        const indexData = fs.readFileSync('src/index.tsx').toString()
        const newIndexData = replaceDefaultShortName(indexData, shortName)
        fs.writeFileSync('src/index.tsx', newIndexData)

        // Rename native modules in `App.tsx`
        const appData = fs.readFileSync('example/app/navigators/app-navigator.js').toString()
        const newAppData = replaceDefaultShortName(appData, shortName).replace(
            DEFAULT_NAME,
            name
        )
        fs.writeFileSync('example/app/navigators/app-navigator.js', newAppData)

        // // Modify example's `project.pbxproj`
        // const exampleProjectData = fs
        //     .readFileSync(`example/ios/${DEFAULT_SHORT_NAME}Example.xcodeproj/project.pbxproj`)
        //     .toString()
        // const newExampleProjectData = replaceDefaultShortName(
        //     exampleProjectData,
        //     shortName
        // )
        // fs.writeFileSync(
        //     `example/ios/${DEFAULT_SHORT_NAME}Example.xcodeproj/project.pbxproj`,
        //     newExampleProjectData
        // )

        // // Modify `settings.gradle`
        // const settingsData = fs
        //     .readFileSync('example/android/settings.gradle')
        //     .toString()
        // const newSettingsData = settingsData.replace(
        //     new RegExp(DEFAULT_NAME, 'g'),
        //     name
        // )
        // fs.writeFileSync('example/android/settings.gradle', newSettingsData)

        // // Modify `build.gradle`
        // const buildData = fs
        //     .readFileSync('example/android/app/build.gradle')
        //     .toString()
        // const newBuildData = buildData.replace(
        //     new RegExp(DEFAULT_NAME, 'g'),
        //     name
        // )
        // fs.writeFileSync('example/android/app/build.gradle', newBuildData)

        // // Modify `MainApplication.java`
        // const mainApplicationData = fs
        //     .readFileSync(
        //         `example/android/app/src/main/java/com/example/${DEFAULT_ANDROID_NAME}/MainApplication.java`
        //     )
        //     .toString()
        // const newMainApplicationData = replaceDefaultShortName(
        //     mainApplicationData,
        //     shortName
        // ).replace(defaultAndroidPackageName, androidPackageName)
        // fs.writeFileSync(
        //     `example/android/app/src/main/java/com/example/${DEFAULT_ANDROID_NAME}/MainApplication.java`,
        //     newMainApplicationData
        // )

    } catch (err) {
        console.log(err)
    }
}