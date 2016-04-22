var submitStudent = document.getElementById('submitStudent');
submitStudent.addEventListener('click', function(){
    addStudent(document.getElementById('inputStudentName').value, document.getElementById('inputStudentSurname').value, document.getElementById('inputStudentTeam').value)
});
function initSelects(){
    var teams = showTable('teams');
    teams.data.forEach(function(team){
        document.getElementById('inputStudentTeam').options[document.getElementById('inputStudentTeam').options.length] = new Option(team.name, team.id);
    });

}
initSelects();