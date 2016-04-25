'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var submitStudent = $('.submitStudent');
var submitTeam = $('#submitTeam');
var submitTask = $('.submitTask');
var submitMentor = document.getElementById('submitMentor');
$('.inputTaskHostTable').on('change', function (e) {
    var value = this.value;
    changeInputTaskHosts(value);
});

submitStudent.on('click', function () {
    if (!$('#inputStudentName').val() || !$('#inputStudentSurname').val()) {
        alert('Заполните поля!');
    } else {
        addStudent($('#inputStudentName').val(), $('#inputStudentSurname').val(), $('#inputStudentTeam').val());
    }
});
submitTeam.on('click', function () {
    if (!$('#inputTeamName').val()) {
        alert('Заполните поля!');
    } else {
        addTeam($('#inputTeamName').val(), $('#inputTeamStudents').val());
    }
});
submitTask.on('click', function () {
    console.log($(this).parent());
    var parent = '#' + $(this).parent().attr('id');
    console.log($(parent + ' .inputTaskHostTable'));
    addTask.call($(parent + ' .inputTaskHostTable').val(), $(parent + ' .inputTaskHosts').val(), $(parent + ' .inputTaskName').val(), $(parent + '.inputTaskDescription').val(), $(parent + ' .inputTaskMark').val());
    //initTables();//hostId, name, description, mark
});
submitMentor.onclick = function () {
    if (!$('#inputMentorName').val() || !$('#inputMentorSurname').val()) {
        alert('Заполните поля!');
    } else {
        addMentor($('#inputMentorName').val(), $('#inputMentorSurname').val());
    }
};
function initAllSelects() {
    var teams = retrieveTable('teams');
    var students = retrieveTable('students');
    $('#inputStudentTeam').empty();
    $('#inputTeamStudents').empty();
    initSelect(teams, $('#inputStudentTeam'));
    initSelect(students, $('#inputTeamStudents'));
}
function initTables() {
    var students = retrieveTable('students');
    var htmlString = '<thead><tr><th>ID</th><th>Имя</th><th>Фамилия</th><th>ID команды</th><th>ID заданий</th>><th>ID приоритета</th></tr></thead><tbody>';
    students.data.forEach(function (student) {
        htmlString += '<tr><td>' + clr(student.id) + '</td><td>' + clr(student.name) + '</td><td>' + clr(student.surname) + '</td><td>' + clr(student.teamId) + ' <button onclick="" class="btn btn-default">Изменить команду</button></td><td>' + clr(student.tasksIds) + ' <button onclick="" class="btn btn-default">Добавить задание</button></td><td>' + clr(student.prior) + ' <button onclick="" class="btn btn-default">Изменить приоритетного ментора</button></td><td><button onclick="deleteStudent(' + student.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    $('#tableStudents').html(htmlString);

    var teams = retrieveTable('teams');
    htmlString = '<thead><tr><th>ID </th><th>Название</th><th>ID студентов</th><th>ID заданий</th></tr></thead><tbody>';
    teams.data.forEach(function (team) {
        htmlString += '<tr><td>' + clr(team.id) + '</td><td>' + clr(team.name) + '</td><td>' + clr(team.studentsIds) + ' <button onclick="" class="btn btn-default">Добавить студентов</button></td><td>' + clr(team.tasksIds) + ' <button onclick="" class="btn btn-default">Добавить задание</button></td><td><button onclick="deleteTeam(' + team.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    $('#tableTeams').html(htmlString);

    var tasks = retrieveTable('tasks');
    htmlString = '<thead><tr><th>ID</th><th>Название</th><th>Описание</th><th>Оценка</th><th>Таблица владельца</th><th>ID владельца</th></tr></thead><tbody>';
    tasks.data.forEach(function (task) {
        htmlString += '<tr><td>' + clr(task.id) + '</td><td>' + clr(task.name) + '</td><td>' + clr(task.description) + '</td><td>' + clr(task.mark) + ' <button onclick="" class="btn btn-default">Изменить оценку</button></td><td>' + clr(task.ownerTableName) + '</td><td>' + clr(task.ownerId) + '</td><td><button onclick="deleteTask(' + task.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    $('#tableTasks').html(htmlString);

    var mentors = retrieveTable('mentors');
    htmlString = '<thead><tr><th>ID</th><th>Имя</th><th>Фамилия</th><th>ID приоритетаа</th></tr></thead><tbody>';
    mentors.data.forEach(function (mentor) {
        htmlString += '<tr><td>' + clr(mentor.id) + '</td><td>' + clr(mentor.name) + '</td><td>' + clr(mentor.surname) + '</td><td>' + clr(mentor.prior) + ' <button onclick="" class="btn btn-default">Изменить приоритетного студента</button></td><td><button onclick="deleteMentor(' + mentor.id + ')" class="btn btn-default glyphicon glyphicon-minus"></button></td></tr>';
    });
    htmlString += '</tbody>';
    $('#tableMentors').html(htmlString);
    var list = makePriorList();
    htmlString = '<thead><tr><th>Ментор</th><th>Студент</th></tr></thead><tbody>';
    list.forEach(function (item) {
        htmlString += '<tr><td>' + item.mentor.name + ' ' + item.mentor.surname + ' (' + item.mentor.id + ')</td><td>' + item.student.name + ' ' + item.student.surname + ' (' + item.student.id + ')</td></tr>';
    });
    htmlString += '</tbody>';
    $('#tablePriorList').html(htmlString);
    $('.btn').on('click', initTables);
    initAllSelects();
}
function changeInputTaskHosts(host) {
    $('.inputTaskHosts').empty();
    var table = retrieveTable(host);
    if (host === 'students') {
        initSelect(table, $('.inputTaskHosts'));
    } else if (host === 'teams') {
        initSelect(table, $('.inputTaskHosts'));
    }
}
function initSelect(table, select) {
    if (table.name === 'students' || table.name === 'mentors') {
        table.data.forEach(function (item) {
            select.append($("<option></option>").attr("value", item.id).text(item.name + ' ' + item.surname + ' (id = ' + item.id + ')'));
        });
    } else {
        table.data.forEach(function (item) {
            select.append($("<option></option>").attr("value", item.id).text(item.name + ' (id = ' + item.id + ')'));
        });
    }
}
function clr(title) {
    if ((typeof title === 'undefined' ? 'undefined' : _typeof(title)) === 'object') {
        if (title.length === 0) {
            return '-';
        }
    } else if (title === undefined) {
        return '-';
    }
    return title;
}

function showPriorModal() {}
function showTaskModal() {}
function showStudentsModal() {}
function showTeamsModal() {
    $('#myModal').modal('show');
}
initTables();
//changeInputTaskHosts('');