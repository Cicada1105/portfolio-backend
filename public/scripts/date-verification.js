(function() {
  const form = document.forms[1];
  const error = document.getElementsByClassName('error')[0];
  const startMonthInput = document.getElementById('start-month');
  const startYearInput = document.getElementById('start-year');
  const endMonthInput = document.getElementById('end-month');
  const endYearInput = document.getElementById('end-year');

  form.addEventListener('submit',function(e) {
    const startMonth = startMonthInput.value;
    const startYear = startYearInput.value;
    const endMonth = endMonthInput.value;
    const endYear = endYearInput.value;

    let startDate = new Date(`${startMonth} ${startYear}`) ;
    let endDate = new Date(`${endMonth} ${endYear}`);

    if ( startDate > endDate ) {
      e.preventDefault();

      error.textContent = `Start month and year must be before end month and yaer`;
      setTimeout(() => error.textContent = '', 5000);
    }
  })
})()