import Dashboard from '../containers/dashboard/index'
import MyInvoice from '../containers/myinvoice/index'
import DownloadInvoice from '../component/downloadinvoice/index'
import Pdfdata from '../containers/pdfdata/index'

// routes for declare new pages
const routes = [
    { path: '/', component: Dashboard, exact: true },
    { path: '/my-invoice', component: MyInvoice, exact: true },
    { path: '/download-invoice', component: DownloadInvoice, exact: true },
    { path: '/dashboard', component: Dashboard, exact: true },
    { path: '/pdfdata', component: Pdfdata, exact: true },
]

export default routes;