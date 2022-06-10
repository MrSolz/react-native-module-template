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
    const androidName = shortName;
    try {
        // Clear `README.md`
        fs.writeFileSync('README.md', '')

        if (jsOnly) {
            // JS only mode
            // Remove .podspec
            fs.unlinkSync(`${DEFAULT_NAME}.podspec`)
        }

        // Modify `package.json`
        const packageData = fs.readFileSync('package.json').toString()
        let newPackageData = packageData
            .replace(DEFAULT_URL, url)
            .replace(new RegExp(DEFAULT_NAME, 'g'), name)
            .replace(DEFAULT_AUTHOR_NAME, authorName)
            .replace(DEFAULT_AUTHOR_EMAIL, authorEmail)
            .replace(/"description": ".+"/g, '"description": ""')
            .replace(/"version": ".+"/g, '"version": "1.0.0"')
        if (jsOnly) {
            // JS only mode
            // Supply only `lib` folder in `package.json`
            newPackageData = newPackageData.replace(
                /"files": \[.+\],/s,
                '"files": [\n    "lib"\n  ],'
            )
        }
        fs.writeFileSync('package.json', newPackageData)

        // Modify author in `LICENSE`
        const licenseData = fs.readFileSync('LICENSE').toString()
        const newLicenseData = licenseData.replace(DEFAULT_AUTHOR_NAME, authorName)
        fs.writeFileSync('LICENSE', newLicenseData)

        // Modify example's `tsconfig.json`
        // const tsConfigData = fs.readFileSync('example/tsconfig.json').toString()
        // const newTsConfigData = tsConfigData.replace(DEFAULT_NAME, name)
        // fs.writeFileSync('example/tsconfig.json', newTsConfigData)

        if (jsOnly) {
            // JS only mode
            // Remove native modules from `index.tsx`
            const indexData = fs.readFileSync('src/index.tsx').toString()
            const newIndexData = indexData
                .replace(
                    new RegExp(
                        `\nexport default NativeModules.${DEFAULT_SHORT_NAME}Module\n`,
                        'g'
                    ),
                    ''
                )
                .replace('NativeModules, ', '')
            fs.writeFileSync('src/index.tsx', newIndexData)

            // Remove native modules from `App.tsx`
            const appData = fs.readFileSync('example/app/navigators/app-navigator.js').toString()
            const newAppData = appData
                .replace(`${DEFAULT_SHORT_NAME}Module, `, '')
                .replace(`${DEFAULT_SHORT_NAME}Module`, "''")
                .replace(DEFAULT_NAME, name)
            fs.writeFileSync('example/app/navigators/app-navigator.js', newAppData)

            // Remove native folders
            fs.rmdirSync('ios', { recursive: true })
            fs.rmdirSync('android', { recursive: true })
        } else {
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

        }
    } catch (err) {
        console.log(err)
    }
}