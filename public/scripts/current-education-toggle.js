(function() {
  const isCurrentEducation = document.getElementById('is-current-education');

  const endMonthInput = document.getElementById('end-month');
  const endMonthInputCont = endMonthInput.parentElement;
  const endMonthInputCtrl = endMonthInputCont.parentElement;
  const endMonthLabel = endMonthInputCtrl.getElementsByTagName('label')[0];

  const endYearInput = document.getElementById('end-year');
  const endYearInputCont = endYearInput.parentElement;
  const endYearInputCtrl = endYearInputCont.parentElement;
  const endYearLabel = endYearInputCtrl.getElementsByTagName('label')[0]

  isCurrentEducation.addEventListener('change',() => {
    let isCurrent = isCurrentEducation.checked;
    let currentColor = isCurrent ? 'light-dark(graytext, rgb(170, 170, 170))' : 'black'; 
    let currentBorderColor = isCurrent ? 'rgba(118, 118, 118, 0.3)' : 'black';
    
    endMonthLabel.style.color = currentColor;
    endMonthInput.toggleAttribute('disabled');
    endMonthInput.style.borderColor = currentBorderColor;
    endYearLabel.style.color = currentColor;
    endYearInput.toggleAttribute('disabled');
    endYearInput.style.borderColor = currentBorderColor;
  }) 
})();