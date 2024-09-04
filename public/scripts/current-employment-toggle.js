let addForm = document.forms[1];
let isCurrentEmploymentEl = addForm['is_current_employment'];

let endMonthInput = addForm['end_month'];
let endMonthInputCont = endMonthInput.parentElement;
let endMonthInputCtrl = endMonthInputCont.parentElement;
let endMonthLabel = endMonthInputCtrl.getElementsByTagName('label')[0];

let endYearInput = addForm['end_year'];
let endYearInputCont = endYearInput.parentElement;
let endYearInputCtrl = endYearInputCont.parentElement;
let endYearLabel = endYearInputCtrl.getElementsByTagName('label')[0]

isCurrentEmploymentEl.addEventListener('change',() => {
  let isCurrent = isCurrentEmploymentEl.checked;
  let currentColor = isCurrent ? 'light-dark(graytext, rgb(170, 170, 170))' : 'black'; 
  let currentBorderColor = isCurrent ? 'rgba(118, 118, 118, 0.3)' : 'black';
  let show = isCurrent ? 'none' : 'flex';
  
  endMonthLabel.style.color = currentColor;
  endMonthInput.toggleAttribute('disabled');
  endMonthInput.style.borderColor = currentBorderColor;
  endYearLabel.style.color = currentColor;
  endYearInput.toggleAttribute('disabled');
  endYearInput.style.borderColor = currentBorderColor;
})