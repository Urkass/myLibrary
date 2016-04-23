'use strict';

var submitStudent = document.getElementById('submitStudent');
var submitTeam = document.getElementById('submitTeam');
var submitTask = document.getElementById('submitTask');
var submitMentor = document.getElementById('submitMentor');

submitStudent.onclick = function () {
    addStudent(document.getElementById('inputStudentName').value, document.getElementById('inputStudentSurname').value, document.getElementById('inputStudentTeam').value);
    initTables();
};
submitTeam.onclick = function () {
    console.log(document.getElementById('inputTeamStudents').value);
    addTeam(document.getElementById('inputTeamName').value, document.getElementById('inputTeamStudents').value);
    initTables();
};
//submitTask.onclick = function(){
//    addStudent(document.getElementById('inputStudentName').value, document.getElementById('inputStudentSurname').value, document.getElementById('inputStudentTeam').value)
//    initTables();
//};
submitMentor.onclick = function () {
    addMentor(document.getElementById('inputMentorName').value, document.getElementById('inputMentorSurname').value);
    initTables();
};
function initSelects() {
    var teams = showTable('teams');
    var students = showTable('students');
    teams.data.forEach(function (team) {
        document.getElementById('inputStudentTeam').options[document.getElementById('inputStudentTeam').options.length] = new Option(team.name, team.id);
    });
    students.data.forEach(function (student) {
        document.getElementById('inputTeamStudents').options[document.getElementById('inputTeamStudents').options.length] = new Option(student.name + ' ' + student.surname, student.id);
    });
}
function initTables() {
    var students = showTable('students');
    var htmlString = '<thead><tr><th>${student.id}</th><th>${student.name}</th><th>${student.surname}</th><th>${student.teamId}</th><th>${student.tasksIds}</th></tr></thead><tbody>';
    students.data.forEach(function (student) {
        htmlString += '<tr><td>' + student.id + '</td><td>' + student.name + '</td><td>' + student.surname + '</td><td>' + student.teamId + '</td><td>' + student.tasksIds + '</td></td>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableStudents').innerHTML = htmlString;

    var teams = showTable('teams');
    htmlString = '<thead><tr><th>${team.id}</th><th>${team.name}</th><th>${team.studentsIds}</th></tr></thead><tbody>';
    teams.data.forEach(function (team) {
        htmlString += '<tr><td>' + team.id + '</td><td>' + team.name + '</td><td>' + team.studentsIds + '</td></td>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableTeams').innerHTML = htmlString;

    var tasks = showTable('tasks');
    htmlString = '<thead><tr><th>${task.id}</th><th>${task.name}</th><th>${task.description}</th><th>${task.ownerTableName}</th><th>${task.ownerId}</th></tr></thead><tbody>';
    tasks.data.forEach(function (task) {
        htmlString += '<tr><td>' + task.id + '</td><td>' + task.name + '</td><td>' + task.description + '</td><td>' + task.ownerTableName + '</td><td>' + task.ownerId + '</td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableTasks').innerHTML = htmlString;

    var mentors = showTable('mentors');
    htmlString = '<thead><tr><th>${mentor.id}</th><th>${mentor.name}</th><th>${mentor.surname}</th></tr></thead><tbody>';
    mentors.data.forEach(function (mentor) {
        htmlString += '<tr><td>' + mentor.id + '</td><td>' + mentor.name + '</td><td>' + mentor.surname + '</td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableMentors').innerHTML = htmlString;
}
initSelects();
initTables();