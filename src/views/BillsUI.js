import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const frToEn = {
  "Jan":"Jan",
  "Fév":"Feb",
  "Mar":"Mar",
  "Avr":"Apr",
  "Mai":"May",
  "Jui":"Jun",
  "Jul":"Jul",
  "Aoû":"Aug",
  "Sep":"Sep",
  "Oct":"Oct",
  "Nov":"Nov",
  "Déc":"Dec"
}

function getDate(input) {
  if(input.includes(' ')) {
    const month = input.split(" ")[1].slice(0, 3);
    return new Date(input.replace(month, frToEn[month]));
  } else {
    return new Date(input)
  }
  
}

const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }

const rows = (data) => {
  return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
}

export default ({ data: bills, loading, error }) => {
  
  const modal = () => (`
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  const sortedBills = Array.isArray(bills) ? bills.sort((a, b) => (getDate(b.date))- (getDate(a.date))) : [];
  
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title' data-testid="my-bills"> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(sortedBills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}