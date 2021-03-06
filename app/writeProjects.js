var path = window.require('path');
var ui = window.require('./ui')();

module.exports = writeProjects;

// отрисовка списка проектов
function writeProjects(ps) {
	if (ps.length === 0) { return; };

	var projectsPath = window.localStorage.projectsPath;
	var target = ui.projects;

	target.innerHTML = '';

	if (ps.verstak.length) {
		target.innerHTML += writeProjectsGroup(ps.verstak, 'verstak', projectsPath);
	};
	if (ps.polki.length) {
		target.innerHTML += writeProjectsGroup(ps.polki, 'polki', projectsPath);
	};
	if (ps.git.length) {
		target.innerHTML += writeProjectsGroup(ps.git, 'git', projectsPath);
	};
};

// отрисовываем группу проектов
function writeProjectsGroup (ps, type, projectsPath) {
	type = type || 'verstak';

	var projectsGroupName = type;
	var projectName = '';
	var result = '';

	if (['verstak', 'polki'].indexOf(type) > -1) {
		projectsGroupName = projectsGroupName +'.json';
	};

	result += '<div class="Projects__group Projects__group--'+ type +'">';
	result += '<h2 class="Projects__header">'+ projectsGroupName +'</h2>';

	// отрисовываем в зависимости от наличия подпроектов
	ps.forEach(function (project) {
		var projectGroup = '';

		if (!Array.isArray(project)) {
			projectGroup += writeProject(project);
			projectName = project.name.split('/')[0];
		}
		else {
			project.forEach(function(subProject){
				projectGroup += writeProject(subProject)
				projectName = subProject.name.split('/')[0];
			});
		};

		result += '<div class="Project__group" data-project-group-name="'+ projectName +'">';
		result += '<span class="Project__explorer" data-project-path="'+ path.join(projectsPath, projectName) +'">Открыть в проводнике</span>';
		result += projectGroup;
		result += '<span class="Project__branch"></span>';
		result += '</div>';
	});

	result += '</div>';

	return result;
};

// отрисовываем проект
function writeProject(project) {
	var hide = 'hidden';

	if (project.type === 'verstak') {
		hide = '';
	};

	var result = '';

	result += '<div class="Project" data-project-name="'+ project.name +'">';

	if (project.data) {
		result += '<a class="Project__name" href="'+ project.link +'?th=true" target="_blank">'
		+ project.name.replace(/^dev\./, '')
		+ '</a>'
		+ '<span class="Project__data" hidden>'
		+ JSON.stringify(project.data)
		+ '</span>';
	}
	else {
		result += '<span class="Project__name">'
		+ project.name.replace(/^dev\./, '')
		+ '</span>';
	};

	result += '<div class="Project__wrapper" '+ hide +'>'
			+ '<button class="Project__start"></button>'
		+ '</div>'
		+ '<div class="Project__wrapper Project__controls" '+ hide +'>'
		+ 'Обработать '
			+ '<button class="Project__build Project__build--styles">стили</button>, '
			+ '<button class="Project__build Project__build--images">изображения</button>'
		+ '</div>';

	if (project.data && project.data.path && project.data.path.reference) {
		result+= '<div class="ProjectDiff">'
			+ '<button class="ProjectDiff__trigger">Сравнить</button>'
			+ '<div class="ProjectDiff__result"></div>'
		+ '</div>';
	};

	result += '<div class="Project__log"></div>'
		+ '</div>';

	return result;
};
