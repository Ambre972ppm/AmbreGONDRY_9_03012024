import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Envoyer une note de frais </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="new-expense-type" class="bold-label">Type de dépense</label>
                      <select required class="form-control blue-border" data-testid="new-expense-type" id="new-expense-type">
                        <option>Transports</option>
                        <option>Restaurants et bars</option>
                        <option>Hôtel et logement</option>
                        <option>Services en ligne</option>
                        <option>IT et électronique</option>
                        <option>Equipement et matériel</option>
                        <option>Fournitures de bureau</option>
                      </select>
                  </div>
                  <div class="col-half">
                    <label for="new-expense-name" class="bold-label">Nom de la dépense</label>
                    <input type="text" class="form-control blue-border" data-testid="new-expense-name" id="new-expense-name" placeholder="Vol Paris Londres" />
                  </div>
                  <div class="col-half">
                    <label for="new-datepicker" class="bold-label">Date</label>
                    <input required type="date" class="form-control blue-border" data-testid="datepicker" id="new-datepicker" />
                  </div>
                  <div class="col-half">
                    <label for="new-amount" class="bold-label">Montant TTC </label>
                    <input required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="new-amount" id="new-amount" placeholder="348"/>
                  </div>
                  <div class="col-half-row">
                    <div class="flex-col"> 
                      <label for="new-vat" class="bold-label">TVA</label>
                      <input type="number" class="form-control blue-border" data-testid="new-vat" id="new-vat" placeholder="70" />
                    </div>
                    <div class="flex-col">
                      <label for="new-pct" class="white-text">%</label>
                      <input required type="number" class="form-control blue-border" data-testid="new-pct" id="new-pct" placeholder="20" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="col-half">
                    <label for="new-commentary" class="bold-label">Commentaire</label>
                    <textarea class="form-control blue-border" data-testid="new-commentary" id="new-commentary" rows="3"></textarea>
                  </div>
                  <div class="col-half">
                    <label for="new-file" class="bold-label">Justificatif</label>
                    <input required type="file" class="form-control blue-border" data-testid="new-file" id="new-file" />
                  </div>
                </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Envoyer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}