'use strict';

var databank = {
    'students': {
        'name': 'students',
        'data': [{
            'id': 0,
            'name': 'Петр',
            'surname': 'Кузнецов',
            'teamId': 0,
            'tasksIds': [0]
        }, {
            'id': 1,
            'name': 'Василий',
            'surname': 'Соловьев',
            'teamId': 1,
            'tasksIds': [1]
        }, {
            'id': 2,
            'name': 'Джон',
            'surname': 'Малкович',
            'teamId': 0,
            'tasksIds': undefined
        }]
    },
    'teams': {
        'name': 'teams',
        'data': [{
            'id': 0,
            'name': 'Головастики',
            'studentsIds': [0, 2],
            'tasksIds': undefined
        }, {
            'id': 1,
            'name': 'Барселона',
            'studentsIds': [1],
            'tasksIds': [2, 3]
        }]
    },
    'tasks': {
        'name': 'tasks',
        'data': [{
            'id': 0,
            'name': 'Упражнение на смекалку',
            'description': 'В качестве дополнительного задания вы можете реализовать добавление студентов в офлайне с последующей синхронизацией. При выполнении обратите внимание на способы определения режима «онлайн/офлайн».',
            'mark': undefined,
            'ownerTableName': 'students',
            'ownerId': 0
        }, {
            'id': 1,
            'name': 'Задание 1',
            'description': 'Приложение позволяет добавлять и редактировать данные студентов ШРИ (ФИО, ссылку на фотографию и краткую информацию). Для работы в офлайне оно использует ServiceWorker, позволяя при этом, как минимум, просматривать данные студентов.',
            'mark': undefined,
            'ownerTableName': 'students',
            'ownerId': 1
        }, {
            'id': 2,
            'name': 'Для дизайнеров',
            'description': 'Однако при реализации были допущены несколько ошибок: — без подключения к серверу приложение не работает;— не всегда обновляется список студентов после добавления нового.',
            'mark': undefined,
            'ownerTableName': 'teams',
            'ownerId': 1
        }, {
            'id': 3,
            'name': 'Легкое задание',
            'description': 'Мы не ограничиваем вас в использовании сторонних инструментов и библиотек, однако при их использовании также ожидаем комментариев, в которых вы расскажете, зачем и почему вы применили то или иное средство.',
            'mark': undefined,
            'ownerTableName': 'teams',
            'ownerId': 1
        }]
    }
};

if (typeof Storage !== "undefined") {
    for (var table in databank) {
        saveTable(databank[table]);
    }
} else {
    alert('LocalStorage не поддерживается Вашим браузером!');
}

function saveTable(table) {
    try {
        localStorage.setItem(table.name, JSON.stringify(table));
        console.log(table.name + ' saved');
    } catch (e) {
        showLocalstorageSpace();
        console.log('Память закончилась');
    }
}

function deleteAllTables() {
    if (confirm('Удаление ВСЕХ таблиц. Вы уверены?')) {
        Object.keys(databank).forEach(function (table) {
            deleteTable(table);
            console.log(table.name + ' deleted');
        });
    }
}

function deleteTable(tableName) {
    localStorage.removeItem(tableName);
    showLocalstorageSpace();
}

function retrieveTable(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
}

function showLocalstorageSpace() {
    console.log('Осталось места в LocalStorage ' + ((1024 * 1024 * 5 - encodeURIComponent(JSON.stringify(localStorage)).length) / 1024 / 1024).toPrecision(3) + ' MB');
}

function addStudent(name, surname, team) {
    var title = 'students';
    var students = retrieveTable(title);
    var id = retrieveLastId(students) + 1;
    students.data.push({
        'id': id,
        'name': name,
        'surname': surname,
        'teamId': changeStudentTeam.call(title, id, team)
    });
    saveTable(students);
}

function changeStudentTeam(studentId, teamId) {
    teamId = parseInt(teamId);
    if (teamId === undefined) return undefined;
    try {
        //есть ли id этой команды (без контекста (можно для всех))
        var teams = retrieveTable('teams');
        if (retrieveId(teams, teamId) === undefined) {
            throw new Error('Id = ' + teamId + '. Такого id команды нету');
        }
        var students = retrieveTable('students');
        if (this) {
            //проверка на контекст
            teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
            console.log('Добавили студента с id ' + studentId + ' в команду с id ' + teamId);
            saveTable(teams);
            return teamId;
        } else {
            //проверка нету ли еще студента (только для контекста 'students')
            if (!(retrieveId(students, studentId) === undefined)) {
                //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                if (!teams.data[retrieveId(teams, teamId)].studentsIds.includes(studentId)) {
                    teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                    var oldTeamId = students.data[retrieveId(students, studentId)].teamId;
                    var i = teams.data[oldTeamId].studentsIds.indexOf(studentId);
                    if (i != -1) {
                        teams.data[oldTeamId].studentsIds.splice(i, 1);
                    }
                    console.log(teams.data[oldTeamId].studentsIds);
                    students.data[retrieveId(students, studentId)].teamId = teamId;
                    console.log('Изменили у студента с id ' + studentId + ' команду с id ' + oldTeamId + ' на команду с id ' + teamId);
                    saveTable(students);
                    saveTable(teams);
                } else {
                    throw new Error("Студент уже добавлен в эту команду");
                }
            } else {
                throw new Error('Id = ' + studentId + '. Такого id студента нету');
            }
        }
    } catch (e) {
        console.log(e.message);
    }
}

function addTeam(name, students) {
    var title = 'teams';
    var teams = retrieveTable(title);
    var id = retrieveLastId(teams) + 1;
    teams.data.push({
        'id': id,
        'name': name,
        'studentsIds': changeTeamStudents.call(title, id, students)
    });
    saveTable(teams);
}
function showTable(table) {
    var title = table;
    return retrieveTable(title);
}

function changeTeamStudents(teamId, studentIds) {
    if (studentIds === undefined) return undefined;
    var context = this;
    var array = studentIds.map(function (item) {
        var id = insertStudentToTeam.call(context, teamId, item);
        if (id) return id;
    });
    return array;
}

function insertStudentToTeam(teamId, studentId) {
    if (studentId === undefined) return undefined;
    try {
        //есть ли id этой команды (без контекста (можно для всех))
        var students = retrieveTable('students');
        if (retrieveId(students, studentId) === undefined) {
            throw new Error('Id = ' + studentId + '. Такого id студента нету!');
        }
        if (students.data[retrieveId(students, studentId)].teamId !== undefined) {
            throw new Error("У этого студента уже есть команда");
        }

        var teams = retrieveTable('teams');
        if (this) {
            //проверка на контекст
            students.data[retrieveId(students, studentId)].teamId = teamId;
            console.log('Добавили студенту с id ' + studentId + ' команду с id ' + teamId);
            saveTable(students);
            return studentId;
        } else {
            //проверка нету ли еще студента (только для контекста 'students')
            if (!(retrieveId(teams, teamId) === undefined)) {
                //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                if (!teams.data[retrieveId(teams, teamId)].studentsIds.includes(studentId)) {
                    students.data[retrieveId(students, studentId)].teamId = teamId;
                    teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                    console.log('Добавили в команду с id ' + teamId + ' студента с id ' + studentId);
                    saveTable(students);
                    saveTable(teams);
                } else {
                    throw new Error("Студент уже добавлен в эту команду");
                }
            } else {
                throw new Error('Id = ' + teamId + '. Такого id команды нету');
            }
        }
    } catch (e) {
        console.log(e.message);
    }
}
function deleteStudentFromTeam(teamId, studentId) {}

var addStudentTask = addTask.bind('students');
var addTeamTask = addTask.bind('teams');

function addTask(hostId, name, description, mark) {
    var host = retrieveTable(this);
    var id = retrieveLastId(host) + 1;
    host.data.push({
        'id': id,
        'name': name,
        'description': description,
        'mark': mark,
        'ownerTableName': this,
        'ownerId': hostId
    });
}
function addTaskMark() {}
function changeTaskOwner() {}

function retrieveLastId(table) {
    return table.data[table.data.length - 1].id;
}

function retrieveId(table, id) {
    var x = undefined;
    table.data.forEach(function (item) {
        if (item.id === id) {
            x = item.id;
        }
    });
    return x;
}