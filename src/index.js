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
                'studentsIds': [0, 2],
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
    }
};


if(typeof(Storage) !== "undefined") {
    for (let table in databank) {
        saveTable(databank[table]);
    }
} else {
    alert('LocalStorage не поддерживается Вашим браузером!');
}


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

function deleteAllTables(){
    if (confirm('Удаление ВСЕХ таблиц. Вы уверены?')) {
        Object.keys(databank).forEach(function (table) {
            deleteTable(table);
            console.log(`${table.name} deleted`);
        });
    }
}

function deleteTable(tableName){
    localStorage.removeItem(tableName);
    showLocalstorageSpace();
}

function retrieveTable(tableName){
   return JSON.parse(localStorage.getItem(tableName));
}

function showLocalstorageSpace(){
    console.log(`Осталось места в LocalStorage ${((1024 * 1024 * 5 - encodeURIComponent(JSON.stringify(localStorage)).length)/1024/1024).toPrecision(3)} MB`);
}

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

function changeStudentTeam(studentId, teamId){
    if (teamId===undefined) return undefined;
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

function addTeam(name, ...students){
    let title = 'teams';
    let teams = retrieveTable(title);
    let id = retrieveLastId(teams) + 1;
    teams.data.push({
        'id': id,
        'name': name,
        'studentsIds': changeTeamStudents.call(title, id, students)
    });
    saveTable(teams);
}

function changeTeamStudents(teamId, ...studentIds){
    let context = this;
    let array = studentIds.map(function(item){
        let id = insertStudentToTeam.call(context, teamId, item);
        if (id) return id;
    });
    return array;
}

function insertStudentToTeam(teamId, studentId){
    let students = retrieveTable('students');
    try {
        let teams = retrieveTable('teams');
        if(!(retrieveId(teams, teamId) === undefined)) {
            let retrievedId = retrieveId(students, studentId);
            if (!students.data[retrievedId].teamId) {
                students.data[retrievedId].teamId = teamId;
                if (this) {
                    console.log(`Добавили в новосозданную комманду с id ${teamId} студента с id ${studentId}`);
                    saveTable(students);
                    return studentId;
                }
                else {
                    try {
                        //let teams = retrieveTable('teams');
                        teams.data[retrieveId(teams, teamId)].studentsIds.push(studentId);
                        console.log(`Добавили в старую комманду с id ${teamId} студента с id ${studentId}`);
                        saveTable(teams);
                    }
                    catch (e) {
                        console.log(`Id = ${teamId}. Такой команды нету!`);
                    }

                }
            }
            else {
                console.log(`У студента с id ${teamId} уже есть команда! Он не добавлен.`);
                return null;
            }
        }
        else{
            console.log(`Id = ${teamId}. Такой команды нету!`);
        }
    }
    catch(e) {
        console.log(`Id = ${studentId}. Такого id студента нету`);
    }
}
function deleteStudentFromTeam(teamId, studentId){

}

let addStudentTask = addTask.bind('students');
let addTeamTask = addTask.bind('teams');

function addTask(hostId, name, description, mark){
    let host = retrieveTable(this);
    let id = retrieveLastId(host) + 1;
    host.data.push({
        'id': id,
        'name': name,
        'description': description,
        'mark': mark,
        'ownerTableName': this,
        'ownerId': hostId
    });
}

function retrieveLastId(table){
    return table.data[table.data.length-1].id;
}

function retrieveId(table, id) {
    let x = undefined;
    table.data.forEach(function (item) {
        if (item.id === id) {
            x = item.id;
        }
    });
    return x;
}


