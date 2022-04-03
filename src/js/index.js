import 'bulma/bulma.sass' // Сеточная система бибилотеки Bulma

const title = document.getElementById('snippet-title')
const prefix = document.getElementById('snippet-prefix')
const descr = document.getElementById('snippet-descr')
const code = document.getElementById('snippet-code')
const checkboxElems = document.querySelectorAll('input[type=checkbox]')
const result = document.getElementById('snippet-result')
const elems = [title, prefix, descr, code, result, ...checkboxElems]

const snippet = { 
    title: 'Ваш сниппет', 
    scope: '', 
    prefix: '', 
    body: '', 
    description: ''
}

result.value = renderJSON(snippet)

for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    
    elem.addEventListener('input', e => {
        if (elem == title && elem.value != '') {
            snippet.title = elem.value
        }
        else if (elem.getAttribute('type') == 'checkbox') {
            const scope = snippet.scope
            let arr = scope != '' ? scope.split(',') : []

            if (elem.checked) {
                snippet.scope = [elem.value, ...arr].join(',')
            }
            else {
                snippet.scope = arr.filter(e => { return e != elem.value }).join(',')
            }
        }
        else if (elem == prefix && elem.value != '') {
            snippet.prefix = elem.value
        }
        else if (elem == descr && elem.value != '') {
            snippet.description = elem.value.replace(/\n/g, '\\n\\r')
        }
        else if (elem == code && elem.value != '') {
            const value = elem.value
            const arr = value.split('\n')
            const qSpacesLast = (arr[arr.length - 1].match(/^\s*/)[0]||[]).length
            const qTabsLast = (arr[arr.length - 1].match(/^\t*/)[0]||[]).length
            let arrSpace = []
            let arrTabs = []

            for (let i = 0; i < arr.length; i++) {
                arrSpace.push(arr[i].replace(' '.repeat(qSpacesLast), '').replace('    ', '\\t'))
                arrTabs.push(arr[i].replace('\t'.repeat(qTabsLast), '').replace(/\t/g, '\\t'))
            }

            arrSpace = arrSpace.join('\\n').replace(/"/g, '\\"').trim()
            arrTabs = arrTabs.join('\\n').replace(/"/g, '\\"').trim()

            snippet.body = arrSpace.length < arrTabs.length ? arrSpace : arrTabs
        }

        result.value = renderJSON(snippet)
    })
}

function renderJSON(snippet) {
    return `
"${snippet.title}": {
    "scope": "${snippet.scope}",
    "prefix": "${snippet.prefix}",
    "body": "${snippet.body}",
    "description": "${snippet.description}"
}
`.trim()
}

result.addEventListener('focus', e => {
    result.setSelectionRange(0, result.value.length)
})