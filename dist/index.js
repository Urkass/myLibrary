'use strict';

var databank = {
    'students': {
        'name': 'students',
        'data': [{
            'id': 0,
            'name': 'Петр',
            'surname': 'Кузнецов',
            'teamId': 0,
            'tasksIds': [0],
            'prior': 4
        }, {
            'id': 1,
            'name': 'Василий',
            'surname': 'Соловьев',
            'teamId': 1,
            'tasksIds': [1],
            'prior': 0
        }, {
            'id': 2,
            'name': 'Джон',
            'surname': 'Малкович',
            'teamId': 0,
            'tasksIds': [],
            'prior': 1
        }]
    },
    'teams': {
        'name': 'teams',
        'data': [{
            'id': 0,
            'name': 'Головастики',
            'studentsIds': [0, 2],
            'tasksIds': []
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
    },
    'mentors': {
        'name': 'mentors',
        'data': [{
            'id': 0,
            'name': 'Брюс',
            'surname': 'Ли',
            'prior': 2
        }, {
            'id': 1,
            'name': 'Геннадий',
            'surname': 'Хазанов',
            'prior': 2
        }, {
            'id': 2,
            'name': 'Том',
            'surname': 'Делонг',
            'prior': 0
        }, {
            'id': 3,
            'name': 'Элвис',
            'surname': 'Пресли',
            'prior': 2
        }, {
            'id': 4,
            'name': 'Бьерн',
            'surname': 'Страуструп',
            'prior': 0
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

/**
 * Save table.
 * @param {Object} table - name of table.
 */
function saveTable(table) {
    try {
        localStorage.setItem(table.name, JSON.stringify(table));
        console.log(table.name + ' saved');
    } catch (e) {
        showLocalstorageSpace();
        console.log('Память закончилась');
    }
}
/**
 * Deleting all tables.
 */
function deleteAllTables() {
    if (confirm('Удаление ВСЕХ таблиц. Вы уверены?')) {
        Object.keys(databank).forEach(function (table) {
            deleteTable(table);
            console.log(table.name + ' deleted');
        });
    }
}
/**
 * Delete table.
 * @param {string} tableName - name of table.
 */
function deleteTable(tableName) {
    localStorage.removeItem(tableName);
    showLocalstorageSpace();
}
/**
 * Retrieve table from the local storage and parse it to json object.
 * @param {string} tableName - name of table.
 * @return {Object} table object
 */
var retrieveTable = function retrieveTable(tableName) {
    return JSON.parse(localStorage.getItem(tableName));
};
/**
 * Show the rest of local storage space in MB.
 */
function showLocalstorageSpace() {
    console.log('Осталось места в LocalStorage ' + ((1024 * 1024 * 5 - encodeURIComponent(JSON.stringify(localStorage)).length) / 1024 / 1024).toPrecision(3) + ' MB');
}
/**
 * Add new student.
 * @param {string} name - student's name.
 * @param {string} surname - student's surname.
 * @param {number} team - team's id (can be empty).
 */
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
/**
 * Delete student.
 * @param {number} studentId - student's id.
 */
function deleteStudent(studentId) {
    var title = 'students';
    var students = retrieveTable(title);
    if (!(retrieveIndex(students, studentId) === undefined)) {
        if (students.data.length === 1) {
            students.data = [];
        } else {
            students.data.splice(retrieveIndex(students, studentId), 1);
        }
        deleteStudentFromTeam(studentId);
        deleteStudentFromTask(studentId);
        deleteStudentFromMentorPrior(studentId);
        saveTable(students);
    } else {
        console.log('Id = ' + studentId + '. Такого id студента нету');
    }
}
/**
 * Delete student from team.
 * @param {number} studentId - student's id.
 */
function deleteStudentFromTeam(studentId) {
    var teams = retrieveTable('teams');
    var students = retrieveTable('students');
    var teamId = students.data[retrieveIndex(students, studentId)].teamId;
    if (teamId !== undefined) {
        var i = teams.data[retrieveIndex(teams, teamId)].studentsIds.indexOf(studentId);
        if (i == 1) {
            teams.data[retrieveIndex(teams, teamId)].studentsIds = [];
        } else {
            teams.data[retrieveIndex(teams, teamId)].studentsIds.splice(i, 1);
        }
        saveTable(teams);
    }
}
/**
 * Delete student from task.
 * @param {number} studentId - student's id.
 */
function deleteStudentFromTask(studentId) {
    var tasks = retrieveTable('tasks');
    var students = retrieveTable('students');
    var tasksIds = students.data[retrieveIndex(students, studentId)].tasksIds;
    if (tasksIds === undefined) return;
    if (tasksIds || tasksIds.length > 0) {
        tasksIds.forEach(function (taskId) {
            var id = retrieveIndex(tasks, taskId);
            if (tasks.data[id].ownerTableName === 'students') {
                tasks.data[id].ownerId = undefined;
                tasks.data[id].ownerTableName = undefined;
            }
        });
        saveTable(tasks);
    }
}
/**
 * Delete student from mentors attribute prior.
 * @param {number} studentId - student's id.
 */
function deleteStudentFromMentorPrior(studentId) {
    var mentors = retrieveTable('mentors');
    var students = retrieveTable('students');
    if (retrieveIndex(students, studentId) !== undefined) {
        mentors.data.forEach(function (mentor) {
            if (mentor.prior === studentId) mentor.prior = undefined;
        });
    } else {
        condole.log('Такого студента не существует!');
    }
    saveTable(mentors);
}
/**
 * Take one student and change his team.
 * Use to change student's team.
 * @param {number} studentId - student's id.
 * @param {number} teamId - team's id.
 * @return {number} teamId if function is called from addStudent() (context 'students')
 */
function changeStudentTeam(studentId, teamId) {
    teamId = parseInt(teamId);
    if (teamId === undefined || isNaN(teamId)) return undefined;
    try {
        //есть ли id этой команды (без контекста (можно для всех))
        var teams = retrieveTable('teams');
        if (retrieveIndex(teams, teamId) === undefined) {
            throw new Error('Id = ' + teamId + '. Такого id команды нету');
        }
        var students = retrieveTable('students');
        if (this) {
            //проверка на контекст
            teams.data[retrieveIndex(teams, teamId)].studentsIds.push(studentId);
            console.log('Добавили студента с id ' + studentId + ' в команду с id ' + teamId);
            saveTable(teams);
            return teamId;
        } else {
            //проверка нету ли еще студента (только для контекста 'students')
            if (!(retrieveIndex(students, studentId) === undefined)) {
                //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                if (!teams.data[retrieveIndex(teams, teamId)].studentsIds.includes(studentId)) {
                    teams.data[retrieveIndex(teams, teamId)].studentsIds.push(studentId);
                    var oldTeamId = students.data[retrieveIndex(students, studentId)].teamId;
                    var i = teams.data[oldTeamId].studentsIds.indexOf(studentId);
                    if (i != -1) {
                        if (i === 1) {
                            teams.data[oldTeamId].studentsIds = [];
                        } else {
                            teams.data[oldTeamId].studentsIds.splice(i, 1);
                        }
                    }
                    console.log(teams.data[oldTeamId].studentsIds);
                    students.data[retrieveIndex(students, studentId)].teamId = teamId;
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
/**
 * Add new team.
 * @param {string} name - team's name.
 * @param {...number} ...students - students' list of ids.
 */
function addTeam(name) {
    for (var _len = arguments.length, students = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        students[_key - 1] = arguments[_key];
    }

    console.log(students);
    var title = 'teams';
    var teams = retrieveTable(title);
    var id = retrieveLastId(teams) + 1;
    teams.data.push({
        'id': id,
        'name': name,
        'studentsIds': changeTeamStudents.call.apply(changeTeamStudents, [title, id].concat(students))
    });
    saveTable(teams);
}
/**
 * Delete team.
 * @param {number} teamId - team's id.
 */
function deleteTeam(teamId) {
    var title = 'teams';
    var teams = retrieveTable(title);
    if (!(retrieveIndex(teams, teamId) === undefined)) {
        if (teams.data.length === 1) {
            teams.data = [];
        } else {
            teams.data.splice(retrieveIndex(teams, teamId), 1);
        }
        deleteTeamFromStudents(teamId);
        deleteTeamFromTask(teamId);
        saveTable(teams);
    } else {
        console.log('Id = ' + studentId + '. Такого id команды нету');
    }
}
/**
 * Delete team from students.
 * @param {number} teamId - team's id.
 */
function deleteTeamFromStudents(teamId) {
    var teams = retrieveTable('teams');
    var students = retrieveTable('students');
    var studentsIds = teams.data[retrieveIndex(teams, teamId)].studentsIds;
    if (studentsIds || studentsIds.length > 0) {
        studentsIds.forEach(function (studentId) {
            students.data[retrieveIndex(students, studentId)].teamId = undefined;
        });
        saveTable(students);
    }
}
/**
 * Delete team from task.
 * @param {number} teamId - team's id.
 */
function deleteTeamFromTask(teamId) {
    var tasks = retrieveTable('tasks');
    var teams = retrieveTable('teams');
    var tasksIds = teams.data[retrieveIndex(teams, teamId)].tasksIds;
    if (tasksIds || tasksIds.length > 0) {
        tasksIds.forEach(function (taskId) {
            var id = retrieveIndex(tasks, taskId);
            if (tasks.data[id].ownerTableName === 'teams') {
                tasks.data[id].ownerId = undefined;
                tasks.data[id].ownerTableName = undefined;
            }
        });
        saveTable(tasks);
    }
}
/**
 * Take one team and insert students in this team.
 * Use to insert a lot of students in team.
 * @param {number} teamId - team's id.
 * @param {...number} ...studentsIds - students' list of ids.
 * @return {number[]} students' ids if function is called from addTeam() (context 'teams')
 */
function changeTeamStudents(teamId) {
    for (var _len2 = arguments.length, studentsIds = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        studentsIds[_key2 - 1] = arguments[_key2];
    }

    console.log(studentsIds);
    if (studentsIds.length === 0) return undefined;
    var context = this;
    var array = studentsIds.map(function (item) {
        var id = insertStudentToTeam.call(context, teamId, item);
        if (id) return id;
    });
    return array;
}
/**
 * Take one team and insert students in this team.
 * Use to insert one student in team.
 * @param {number} teamId - team's id.
 * @param {number} studentId - student's id.
 * @return {number} student's id if function is called from changeTeamStudents() (context 'teams')
 */
function insertStudentToTeam(teamId, studentId) {
    studentId = parseInt(studentId);
    if (studentId === undefined) return undefined;
    try {
        //есть ли id этой команды (без контекста (можно для всех))
        var students = retrieveTable('students');
        if (retrieveIndex(students, studentId) === undefined) {
            throw new Error('Id = ' + studentId + '. Такого id студента нету!');
        }
        if (students.data[retrieveIndex(students, studentId)].teamId !== undefined) {
            throw new Error("У этого студента уже есть команда");
        }

        var teams = retrieveTable('teams');
        if (this) {
            //проверка на контекст
            students.data[retrieveIndex(students, studentId)].teamId = teamId;
            console.log('Добавили студенту с id ' + studentId + ' команду с id ' + teamId);
            saveTable(students);
            return studentId;
        } else {
            //проверка нету ли еще студента (только для контекста 'students')
            if (!(retrieveIndex(teams, teamId) === undefined)) {
                //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                if (!teams.data[retrieveIndex(teams, teamId)].studentsIds.includes(studentId)) {
                    students.data[retrieveIndex(students, studentId)].teamId = teamId;
                    teams.data[retrieveIndex(teams, teamId)].studentsIds.push(studentId);
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
/**
 * Add new task to student.
 * @global
 * @param {number} hostId - id of an owner.
 * @param {string} name - tasks's name.
 * @param {string} description - task's description.
 * @param {number} mark - task's mark (can be from 0 to 5 if not it would be undefined).
 */
var addStudentTask = addTask.bind('students');
/**
 * Add new task to team.
 * @global
 * @param {number} hostId - id of an owner.
 * @param {string} name - tasks's name.
 * @param {string} description - task's description.
 * @param {number} mark - task's mark (can be from 0 to 5 if not it would be undefined).
 */
var addTeamTask = addTask.bind('teams');
/**
 * Add new task.
 * Dont use from console, use addStudentTask() or addTeamTask() functions instead
 * @param {number} hostId - id of an owner.
 * @param {string} name - tasks's name.
 * @param {string} description - task's description.
 * @param {number} mark - task's mark (can be from 0 to 5 if not it would be undefined).
 */
function addTask(hostId, name, description, mark) {
    var tableName = this;
    if (tableName == undefined) {
        console.log('Воспользуйтесь addStudentTask или addTeamTask!');
        return;
    }
    var tasks = retrieveTable('tasks');
    var id = retrieveLastId(tasks) + 1;
    tasks.data.push({
        'id': id,
        'name': name,
        'description': description,
        'mark': addTaskMark.call(tableName, id, mark),
        'ownerTableName': this,
        'ownerId': changeTaskOwner.call('tasks', id, tableName, hostId)
    });
    saveTable(tasks);
}
/**
 * Add or change team's mark.
 * @param {number} taskId - task's id.
 * @param {number} mark - task's mark (can be from 0 to 5 if not it would be undefined).
 * @return {number} mark (if it is called from addTask() function)
 */
function addTaskMark(taskId, mark) {
    var tasks = retrieveTable('tasks');
    console.log(this);
    mark = parseInt(mark);
    if (mark >= 0 && mark <= 5) {
        if (this) {
            return mark;
        } else {
            if (!(retrieveIndex(tasks, taskId) === undefined)) {
                if (tasks.data[retrieveIndex(tasks, taskId)].mark !== undefined) {
                    if (confirm('Задание с id=' + taskId + ' уже имеет оценку. Заменить?')) {
                        tasks.data[retrieveIndex(tasks, taskId)].mark = mark;
                        saveTable(tasks);
                    } else {
                        console.log('Замена оценки отменена');
                    }
                } else {
                    tasks.data[retrieveIndex(tasks, taskId)].mark = mark;
                    saveTable(tasks);
                }
            } else {
                console.log('Такого id=' + taskId + ' задания не существет');
            }
        }
    } else {
        console.log('Оценка не корректная');
    }
}

/**
 * Delete task.
 * @param {number} taskId - task's id.
 */
function deleteTask(taskId) {
    var title = 'tasks';
    var tasks = retrieveTable(title);
    if (!(retrieveIndex(tasks, taskId) === undefined)) {
        console.log(retrieveIndex(tasks, taskId) + ' and ' + tasks.data[retrieveIndex(tasks, taskId)]);
        if (tasks.data[retrieveIndex(tasks, taskId)].ownerTableName === 'students') {
            deleteTaskFromStudent(taskId);
        } else if (tasks.data[retrieveIndex(tasks, taskId)].ownerTableName === 'teams') {
            deleteTaskFromTeam(taskId);
        } else {
            console.log('хммм');
        }
        if (tasks.data.length === 1) {
            tasks.data = [];
        } else {
            tasks.data.splice(retrieveIndex(tasks, taskId), 1);
        }
        saveTable(tasks);
    } else {
        console.log('Id = ' + taskId + '. Такого id задания нету');
    }
}
/**
 * Delete task from team.
 * @param {number} taskId - task's id.
 */
function deleteTaskFromTeam(taskId) {
    var teams = retrieveTable('teams');
    var tasks = retrieveTable('tasks');
    var ownerId = tasks.data[retrieveIndex(tasks, taskId)].ownerId;
    if (ownerId !== undefined) {
        var i = teams.data[retrieveIndex(teams, ownerId)].tasksIds.indexOf(taskId);
        if (i === 1) {
            teams.data[retrieveIndex(teams, ownerId)].tasksIds = [];
        } else {
            teams.data[retrieveIndex(teams, ownerId)].tasksIds.splice(i, 1);
        }
        saveTable(teams);
    }
}
/**
 * Delete task from student.
 * @param {number} taskId - task's id.
 */
function deleteTaskFromStudent(taskId) {
    var students = retrieveTable('students');
    var tasks = retrieveTable('tasks');
    var ownerId = tasks.data[retrieveIndex(tasks, taskId)].ownerId;
    if (ownerId !== undefined) {
        var i = students.data[retrieveIndex(students, ownerId)].tasksIds.indexOf(taskId);
        if (i === 1) {
            students.data[retrieveIndex(students, ownerId)].tasksIds = [];
        } else {
            students.data[retrieveIndex(students, ownerId)].tasksIds.splice(i, 1);
        }
        saveTable(students);
    }
}
/**
 * Change task owner.
 * @param {number} taskId - task's id.
 * @param {string} tableName - name of table.
 * @param {number} hostId - id of a new owner.
 * @return {number} id of a new owner (If function is called from createTask() function)
 */
function changeTaskOwner(taskId, tableName, hostId) {
    var context = this;
    var host = retrieveTable(tableName);
    if (retrieveIndex(host, hostId) !== undefined) {
        if (this) {
            host.data[retrieveIndex(host, hostId)].tasksIds.push(taskId);
            saveTable(host);
            return hostId;
        } else {
            var tasks = retrieveTable(context);
            if (retrieveIndex(tasks, taskId) === undefined) {
                if (retrieveIndex(tasks, taskId).ownerId !== undefined) {
                    host.data[retrieveIndex(host, hostId)].tasksIds.push(taskId);
                    tasks.data[retrieveIndex(tasks, taskId)].ownerId = hostId;
                    tasks.data[retrieveIndex(tasks, taskId)].ownerTableName = tableName;
                    saveTable(host);
                    saveTable(tasks);
                } else {
                    console.log('У задания уже есть хозяин!');
                }
            } else {
                console.log('Такого задания нету!');
            }
        }
    } else {
        console.log('Такого хозяина нету!');
    }
}
/**
 * Add new mentor.
 * @param {string} name - mentor's name.
 * @param {string} surname - mentor's surname.
 */
function addMentor(name, surname) {
    var title = 'mentors';
    var mentors = retrieveTable(title);
    var id = retrieveLastId(mentors) + 1;
    mentors.data.push({
        'id': id,
        'name': name,
        'surname': surname
    });
    saveTable(mentors);
}
/**
 * Delete mentor.
 * @param {number} mentorId - mentor's id.
 */
function deleteMentor(mentorId) {
    var title = 'mentors';
    var mentors = retrieveTable(title);
    if (!(retrieveIndex(mentors, mentorId) === undefined)) {
        if (mentors.data.length === 1) {
            mentors.data = [];
        } else {
            mentors.data.splice(retrieveIndex(mentors, mentorId), 1);
        }
        deleteMentorFromStudentPrior(mentorId);
        saveTable(mentors);
    } else {
        console.log('Id = ' + mentorId + '. Такого id студента нету');
    }
}
/**
 * Delete mentor from students attribute prior.
 * @param {number} mentorId - mentor's id.
 */
function deleteMentorFromStudentPrior(mentorId) {
    var students = retrieveTable('students');
    var mentors = retrieveTable('mentors');
    if (retrieveIndex(mentors, mentorId) !== undefined) {
        students.data.forEach(function (student) {
            if (student.prior === mentorId) student.prior = undefined;
        });
    } else {
        condole.log('Такого студента не существует!');
    }
    saveTable(students);
}
/**
 * Retrieve the last id of an element in data array in concrete table.
 * @param {Object} table - name of table.
 * @return {number} id of last element
 */
var retrieveLastId = function retrieveLastId(table) {
    if (table.data.length === 0) return 0;else {
        return table.data[table.data.length - 1].id;
    }
};
/**
 * Retrieve index of an element by its id.
 * @param {Object} table - object of table.
 * @param {number} id  - id of an element
 * @return {number} element's index
 */
function retrieveIndex(table, id) {
    var index = undefined;
    table.data.forEach(function (item, i) {
        if (item.id === id) {
            index = i;
        }
    });
    return index;
}
var addStudentPrior = addPrior.bind('students');
var addMentorPrior = addPrior.bind('mentors');
//Prior
function addPrior(hostId, priorId) {
    var title = this;
    var table = retrieveTable(title);
    if (table.data[retrieveIndex(table, hostId)].prior === undefined) {
        table.data[retrieveIndex(table, hostId)].prior = hostId;
    } else {
        if (confirm('У этого студента уже есть приоритетный ментор. Заменить?')) table.data[retrieveIndex(table, hostId)].prior = hostId;
    }
    saveTable(table);
}
function makePriorList() {
    var list = [];
    var title = this;
    var students = retrieveTable('students');
    var mentors = retrieveTable('mentors');
    mentors.data.forEach(function (mentor) {
        students.data.forEach(function (student) {
            if (mentor.id == student.prior && student.id == mentor.prior) {
                list.push({
                    'mentor': mentor,
                    'student': student
                });
            }
        });
    });
    return list;
}