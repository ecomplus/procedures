'use strict'

module.exports = order => {
  // parse curent payment and shipping status to order main status
  let fulfillmentStatus, financialStatus
  if (order.financial_status) {
    financialStatus = order.financial_status.current
  }
  if (order.fulfillment_status) {
    fulfillmentStatus = order.fulfillment_status.current
  }

  switch (financialStatus) {
    case 'paid':
      // closed only if paid and delivered
      return (fulfillmentStatus === 'delivered' ? 'closed' : 'open')

    case 'voided':
    case 'unauthorized':
    case 'refunded':
      switch (fulfillmentStatus) {
        case 'partially_shipped':
        case 'shipped':
        case 'partially_delivered':
        case 'delivered':
        case 'returned_for_exchange':
          // payment cancelled but shipping in process
          return 'open'
        default:
          return 'cancelled'
      }

    default:
      return 'open'
  }
}
