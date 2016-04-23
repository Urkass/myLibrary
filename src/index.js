var databank = {
    'students': {
        'name': 'students',
        'data': [
            {
                'id': 0,
                'name': 'Петр',
                'surname': 'Кузнецов',
                'teamId': 0,
                'tasksIds': [0]
            },
            {
                'id': 1,
                'name': 'Василий',
                'surname': 'Соловьев',
                'teamId': 1,
                'tasksIds': [1]
            },
            {
                'id': 2,
                'name': 'Джон',
                'surname': 'Малкович',
                'teamId': 0,
                'tasksIds': undefined
            }
        ]
    },
    'teams': {
        'name': 'teams',
        'data': [
            {
                'id': 0,
                'name': 'Головастики',
                'studentsIds': [0,2],
                'tasksIds': undefined
            },
            {
                'id': 1,
                'name': 'Барселона',
                'studentsIds': [1],
                'tasksIds': [2, 3]
            }
        ]
    },
    'tasks': {
        'name': 'tasks',
        'data': [
            {
                'id': 0,
                'name': 'Упражнение на смекалку',
                'description': 'В качестве дополнительного задания вы можете реализовать добавление студентов в офлайне с последующей синхронизацией. При выполнении обратите внимание на способы определения режима «онлайн/офлайн».',
                'mark': undefined,
                'ownerTableName': 'students',
                'ownerId': 0
            },
            {
                'id': 1,
                'name': 'Задание 1',
                'description': 'Приложение позволяет добавлять и редактировать данные студентов ШРИ (ФИО, ссылку на фотографию и краткую информацию). Для работы в офлайне оно использует ServiceWorker, позволяя при этом, как минимум, просматривать данные студентов.',
                'mark': undefined,
                'ownerTableName': 'students',
                'ownerId': 1
            },
            {
                'id': 2,
                'name': 'Для дизайнеров',
                'description': 'Однако при реализации были допущены несколько ошибок: — без подключения к серверу приложение не работает;— не всегда обновляется список студентов после добавления нового.',
                'mark': undefined,
                'ownerTableName': 'teams',
                'ownerId': 1
            },
            {
                'id': 3,
                'name': 'Легкое задание',
                'description': 'Мы не ограничиваем вас в использовании сторонних инструментов и библиотек, однако при их использовании также ожидаем комментариев, в которых вы расскажете, зачем и почему вы применили то или иное средство.',
                'mark': undefined,
                'ownerTableName': 'teams',
                'ownerId': 1
            }
        ]
    },
    'mentors': {
        'name': 'mentors',
        'data': [
            {
                'id': 0,
                'name': 'Брюс',
                'surname': 'Ли'
            },
            {
                'id': 1,
                'name': 'Геннадий',
                'surname': 'Хазанов'
            },
            {
                'id': 2,
                'name': 'Том',
                'surname': 'Делонг'
            },
            {
                'id': 3,
                'name': 'Элвис',
                'surname': 'Пресли'
            },
            {
                'id': 4,
                'name': 'Бьерн',
                'surname': 'Страуструп'
            }
        ]
    }
};


if(typeof(Storage) !== "undefined") {
    for (let table in databank) {
        saveTable(databank[table]);
    }
} else {
    alert('LocalStorage не поддерживается Вашим браузером!');
}

/**
 * Save table.
 * @param {string} table - name of table.
 */
function saveTable(table){
    try{
        localStorage.setItem(table.name, JSON.stringify(table));
        console.log(`${table.name} saved`);
    }
    catch (e){
        showLocalstorageSpace();
        console.log('Память закончилась');
    }
}
/**
 * Deleting all tables.
 */
function deleteAllTables(){
    if (confirm('Удаление ВСЕХ таблиц. Вы уверены?')) {
        Object.keys(databank).forEach(function (table) {
            deleteTable(table);
            console.log(`${table.name} deleted`);
        });
    }
}
/**
 * Delete table.
 * @param {string} tableName - name of table.
 */
function deleteTable(tableName){
    localStorage.removeItem(tableName);
    showLocalstorageSpace();
}
/**
 * Retrieve table from the local storage and parse it to json object.
 * @param {string} tableName - name of table.
 * @return {Object} table object
 */
let retrieveTable = (tableName) => JSON.parse(localStorage.getItem(tableName));
/**
 * Show the rest of local storage space in MB.
 */
function showLocalstorageSpace(){
    console.log(`Осталось места в LocalStorage ${((1024 * 1024 * 5 - encodeURIComponent(JSON.stringify(localStorage)).length)/1024/1024).toPrecision(3)} MB`);
}
/**
 * Add new student.
 * @param {string} name - student's name.
 * @param {string} surname - student's surname.
 * @param {number} team - team's id (can be empty).
 */
function addStudent(name, surname, team){
    let title = 'students';
    let students = retrieveTable(title);
    let id = retrieveLastId(students) + 1;
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
    let title = 'students';
    let students = retrieveTable(title);
    if (!(retrieveId(students, studentId) === undefined)) {
        if (students.data.length === 1) {
            students.data = [];
        }
        else{
            students.data.splice(retrieveId(students, studentId), 1);
            deleteStudentFromTeam(studentId);
            deleteStudentFromTask(studentId);
        }
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
    let teams = retrieveTable('teams');
    let students = retrieveTable('students');
    let teamId = students.data[retrieveId(students, studentId)].teamId;
    let i = teams.data[retrieveId(teams, teamId)].studentsIds.indexOf(studentId);
    teams.data[retrieveId(teams, teamId)].studentsIds.splice(i, 1);
    saveTable(teams);
}
/**
 * Delete student from task.
 * @param {number} studentId - student's id.
 */
function deleteStudentFromTask(studentId) {
    let tasks = retrieveTable('tasks');
    let students = retrieveTable('students');
    let tasksIds = students.data[retrieveId(students, studentId)].tasksIds;
    tasksIds.forEach(function(taskId){
        let id = retrieveId(tasks, taskId);
        if(tasks.data[id].ownerTableName === 'students'){
            tasks.data[id].ownerId = undefined;
            tasks.data[id].ownerTableName = undefined;
        }
    });
    saveTable(tasks);
}
/**
 * Take one student and change his team.
 * Use to change student's team.
 * @param {number} studentId - student's id.
 * @param {number} teamId - team's id.
 * @return {number} teamId if function is called from addStudent() (context 'students')
 */
function changeStudentTeam(studentId, teamId){
    teamId=parseInt(teamId);
    if (teamId===undefined || isNaN(teamId) ) return undefined;
    try {//есть ли id этой команды (без контекста (можно для всех))
        let teams = retrieveTable('teams');
        if(retrieveId(teams, teamId) === undefined) {
            throw new Error(`Id = ${teamId}. Такого id команды нету`);
        }
        let students = retrieveTable('students');
        if (this) {//проверка на контекст
                teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                console.log(`Добавили студента с id ${studentId} в команду с id ${teamId}`);
                saveTable(teams);
                return teamId;
        }
        else {
                //проверка нету ли еще студента (только для контекста 'students')
                if(!(retrieveId(students, studentId) === undefined)) {
                    //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                    if (!teams.data[retrieveId(teams, teamId)].studentsIds.includes(studentId)) {
                        teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                        let oldTeamId = students.data[retrieveId(students, studentId)].teamId;
                        let i = teams.data[oldTeamId].studentsIds.indexOf(studentId);
                        if (i != -1) {
                            teams.data[oldTeamId].studentsIds.splice(i, 1);
                        }
                        console.log(teams.data[oldTeamId].studentsIds);
                        students.data[retrieveId(students, studentId)].teamId = teamId;
                        console.log(`Изменили у студента с id ${studentId} команду с id ${oldTeamId} на команду с id ${teamId}`);
                        saveTable(students);
                        saveTable(teams);
                    }
                    else {
                        throw new Error("Студент уже добавлен в эту команду");
                    }
                }
                else{
                    throw new Error(`Id = ${studentId}. Такого id студента нету`);
                }

        }

    }
    catch(e) {
        console.log(e.message);
    }
}
/**
 * Add new team.
 * @param {string} name - team's name.
 * @param {...number} ...students - students' list of ids.
 */
function addTeam(name, ...students){
    console.log(students);
    let title = 'teams';
    let teams = retrieveTable(title);
    let id = retrieveLastId(teams) + 1;
    teams.data.push({
        'id': id,
        'name': name,
        'studentsIds': changeTeamStudents.call(title, id, ...students)
    });
    saveTable(teams);
}
/**
 * Delete team.
 * @param {number} teamId - team's id.
 */
function deleteStudent(teamId) {
    let title = 'students';
    let students = retrieveTable(title);
    if (!(retrieveId(students, studentId) === undefined)) {
        if (students.data.length === 1) {
            students.data = [];
        }
        else{
            students.data.splice(retrieveId(students, studentId), 1);
            deleteStudentFromTeam(studentId);
            deleteStudentFromTask(studentId);
        }
        saveTable(students);
    } else {
        console.log('Id = ' + studentId + '. Такого id студента нету');
    }
}
/**
 * Take one team and insert students in this team.
 * Use to insert a lot of students in team.
 * @param {number} teamId - team's id.
 * @param {...number} ...studentsIds - students' list of ids.
 * @return {number[]} students' ids if function is called from addTeam() (context 'teams')
 */
function changeTeamStudents(teamId, ...studentsIds){
    console.log(studentsIds);
    if (studentsIds.length === 0) return undefined;
    let context = this;
    let array = studentsIds.map(function(item){
        let id = insertStudentToTeam.call(context, teamId, item);
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
function insertStudentToTeam(teamId, studentId){
    studentId=parseInt(studentId);
    if (studentId===undefined) return undefined;
    try {//есть ли id этой команды (без контекста (можно для всех))
        let students = retrieveTable('students');
        if(retrieveId(students, studentId) === undefined) {
            throw new Error(`Id = ${studentId}. Такого id студента нету!`);
        }
        if (students.data[retrieveId(students, studentId)].teamId !== undefined){
            throw new Error("У этого студента уже есть команда");
        }

        let teams = retrieveTable('teams');
        if (this) {//проверка на контекст
                students.data[retrieveId(students, studentId)].teamId = teamId;
                console.log(`Добавили студенту с id ${studentId} команду с id ${teamId}`);
                saveTable(students);
                return studentId;
        }
        else {
            //проверка нету ли еще студента (только для контекста 'students')
            if(!(retrieveId(teams, teamId) === undefined)) {
                //проверка есть ли уже ЭТОТ студент в этой команде (без контекста (можно для всех))
                if (!teams.data[retrieveId(teams, teamId)].studentsIds.includes(studentId)) {
                    students.data[retrieveId(students, studentId)].teamId = teamId;
                    teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                    console.log(`Добавили в команду с id ${teamId} студента с id ${studentId}`);
                    saveTable(students);
                    saveTable(teams);
                }
                else {
                    throw new Error("Студент уже добавлен в эту команду");
                }
            }
            else{
                throw new Error(`Id = ${teamId}. Такого id команды нету`);
            }

        }

    }
    catch(e) {
        console.log(e.message);
    }

}

let addStudentTask = addTask.bind('students');
let addTeamTask = addTask.bind('teams');

function addTask(hostId, name, description, mark){
    let tableName = this;
    let host = retrieveTable(tableName);
    let id = retrieveLastId(host) + 1;
    host.data.push({
        'id': id,
        'name': name,
        'description': description,
        'mark': addTaskMark.call(tableName, hostId, id, mark),
        'ownerTableName': this,
        'ownerId': hostId
    });
}
function addTaskMark(hostId, taskId, mark){
    table = this;
    mark=parseInt(mark);
    if (mark>=0 && mark <=5){
        if (this){
            return mark;
        }
        else{
            if (!(retrieveId(tasks, taskId) === undefined)){
                if (tasks.data[retrieveId(tasks, taskId)].mark !== undefined){
                    if(confirm(`Задание с id=${hostId} уже имеет оценку. Заменить?`)){
                        tasks.data[retrieveId(tasks, taskId)].mark = mark;
                    }
                    else{
                        console.log(`Замена оценки отменена`);
                    }
                }
            }
            else{
                console.log(`Такого id=${hostId} задания не существет`);
            }
        }
    }
    else{
        console.log('Оценка не корректная');
    }
}
function changeTaskOwner(){

}
function addMentor(name, surname){
    let title = 'mentors';
    let mentors = retrieveTable(title);
    let id = retrieveLastId(mentors) + 1;
    mentors.data.push({
        'id': id,
        'name': name,
        'surname': surname,
    });
    saveTable(mentors);
}
let retrieveLastId = (table) => table.data[table.data.length-1].id;
//function retrieveLastId(table){
//    return table.data[table.data.length-1].id;
//}

function retrieveId(table, id) {
    let x = undefined;
    table.data.forEach(function (item) {
        if (item.id === id) {
            x = item.id;
        }
    });
    return x;
}


