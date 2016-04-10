
let plain = $sce => html => $sce.trustAsHtml(html)
plain.$inject = ['$sce']

export default plain
