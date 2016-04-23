'use strict';

var submitStudent = document.getElementById('submitStudent');
var submitTeam = document.getElementById('submitTeam');
var submitTask = document.getElementById('submitTask');
var submitMentor = document.getElementById('submitMentor');

submitStudent.onclick = function () {
    addStudent(document.getElementById('inputStudentName').value, document.getElementById('inputStudentSurname').value, document.getElementById('inputStudentTeam').value);
};
submitTeam.onclick = function () {
    console.log(document.getElementById('inputTeamStudents').value);
    addTeam(document.getElementById('inputTeamName').value, document.getElementById('inputTeamStudents').value);
};
//submitTask.onclick = function(){
//    addStudent(document.getElementById('inputStudentName').value, document.getElementById('inputStudentSurname').value, document.getElementById('inputStudentTeam').value)
//    initTables();
//};
submitMentor.onclick = function () {
    addMentor(document.getElementById('inputMentorName').value, document.getElementById('inputMentorSurname').value);
};
function initSelects() {
    var teams = retrieveTable('teams');
    var students = retrieveTable('students');
    document.getElementById('inputStudentTeam').options.length = 0;
    document.getElementById('inputTeamStudents').options.length = 0;
    teams.data.forEach(function (team) {
        document.getElementById('inputStudentTeam').options[document.getElementById('inputStudentTeam').options.length] = new Option(team.name, team.id);
    });
    students.data.forEach(function (student) {
        document.getElementById('inputTeamStudents').options[document.getElementById('inputTeamStudents').options.length] = new Option(student.name + ' ' + student.surname, student.id);
    });
}
function initTables() {
    var students = retrieveTable('students');
    var htmlString = '<thead><tr><th>${student.id}</th><th>${student.name}</th><th>${student.surname}</th><th>${student.teamId}</th><th>${student.tasksIds}</th></tr></thead><tbody>';
    students.data.forEach(function (student) {
        htmlString += '<tr><td>' + student.id + '</td><td>' + student.name + '</td><td>' + student.surname + '</td><td>' + student.teamId + '</td><td>' + student.tasksIds + '</td><td><button onclick="deleteStudent(' + student.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableStudents').innerHTML = htmlString;

    var teams = retrieveTable('teams');
    htmlString = '<thead><tr><th>${team.id}</th><th>${team.name}</th><th>${team.studentsIds}</th><th>${team.tasksIds}</th></tr></thead><tbody>';
    teams.data.forEach(function (team) {
        htmlString += '<tr><td>' + team.id + '</td><td>' + team.name + '</td><td>' + team.studentsIds + '</td><td>' + team.tasksIds + '</td><td><button onclick="deleteTeam(' + team.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableTeams').innerHTML = htmlString;

    var tasks = retrieveTable('tasks');
    htmlString = '<thead><tr><th>${task.id}</th><th>${task.name}</th><th>${task.description}</th><th>${task.mark}</th><th>${task.ownerTableName}</th><th>${task.ownerId}</th></tr></thead><tbody>';
    tasks.data.forEach(function (task) {
        htmlString += '<tr><td>' + task.id + '</td><td>' + task.name + '</td><td>' + task.description + '</td><td>' + task.mark + '</td><td>' + task.ownerTableName + '</td><td>' + task.ownerId + '</td><td><button onclick="deleteTask(' + task.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableTasks').innerHTML = htmlString;

    var mentors = retrieveTable('mentors');
    htmlString = '<thead><tr><th>${mentor.id}</th><th>${mentor.name}</th><th>${mentor.surname}</th></tr></thead><tbody>';
    mentors.data.forEach(function (mentor) {
        htmlString += '<tr><td>' + mentor.id + '</td><td>' + mentor.name + '</td><td>' + mentor.surname + '</td><td><button onclick="deleteMentor(' + mentor.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    document.getElementById('tableMentors').innerHTML = htmlString;
    var submit = document.getElementsByClassName('btn');
    for (var i = 0; i < submit.length; i++) {
        submit[i].addEventListener('click', initTables);
    }
    initSelects();
}
initTables();