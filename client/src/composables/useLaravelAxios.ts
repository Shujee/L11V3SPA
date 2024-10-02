import axios, { AxiosInstance } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

let ax: AxiosInstance

export default (): AxiosInstance => {
  if (!ax) {
    ax = axios.create({
      baseURL: `https://${import.meta.env.VITE_API_SERVER}/api/`,
      withCredentials: true,
      withXSRFToken: true,
      xsrfHeaderName: 'X-XSRF-TOKEN', // change the name of the header to "X-XSRF-TOKEN" and it should works
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    })

    // Automatically refreshes CSRF cookie if a 419 error occurs.
    const refreshAuthLogic = (failedRequest: string) => {
      return ax
        .get(`https://${import.meta.env.VITE_API_SERVER}/api/csrf-cookie`)
        .then(() => Promise.resolve())
        .catch(reason => {
          console.log(
            JSON.stringify({
              url: failedRequest,
              reason,
            }),
          )
        })
    }

    createAuthRefreshInterceptor(ax, refreshAuthLogic, { statusCodes: [419] })

    //  The following code adds an interceptor that will replace all date/time values in the response with their
    //  ISO equivalent so that HTML5 input elements could accept and display them.
    ax.interceptors.response.use(originalResponse => {
      handleDates(originalResponse.data)
      return originalResponse
    })

    const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/

    const isIsoDateString = (value: any): boolean => {
      return value && typeof value === 'string' && isoDateFormat.test(value)
    }

    const handleDates = (body: any) => {
      if (body === null || body === undefined || typeof body !== 'object') return body

      for (const key of Object.keys(body)) {
        const value = body[key]
        if (isIsoDateString(value)) {
          body[key] = dayjs(value).local()
        } else if (typeof value === 'object') handleDates(value)
      }
    }
  }

  return ax
}
