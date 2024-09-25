(function() {
  const isCurrentEmploymentEl = document.getElementById('is-current-employment');

  const endMonthInput = document.getElementById('end-month');
  const endMonthInputCtrl = endMonthInput.parentElement;
  const endMonthLabel = endMonthInputCtrl.getElementsByTagName('label')[0];

  const endYearInput = document.getElementById('end-year');
  const endYearInputCtrl = endYearInput.parentElement;
  const endYearLabel = endYearInputCtrl.getElementsByTagName('label')[0]

  isCurrentEmploymentEl.addEventListener('change',() => {
    let isCurrent = isCurrentEmploymentEl.checked;
    let currentColor = isCurrent ? 'light-dark(graytext, rgb(170, 170, 170))' : 'black'; 
    let currentBorderColor = isCurrent ? 'rgba(118, 118, 118, 0.3)' : 'black';
    
    endMonthLabel.style.color = currentColor;
    endMonthInput.toggleAttribute('disabled');
    endMonthInput.style.borderColor = currentBorderColor;
    endYearLabel.style.color = currentColor;
    endYearInput.toggleAttribute('disabled');
    endYearInput.style.borderColor = currentBorderColor;
  })
})()