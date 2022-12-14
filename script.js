$(document).ready(function(){
  var getAndDisplayAllTasks = function (filter) {
    if (!filter) {
      filter = 'all';
    }

    $.ajax({
      type: 'GET',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=5',
      dataType: 'json',
      success: function (response, textStatus) {
          $('#todo-list').empty();
          var activeTasks = 0;
          response.tasks.filter(function(task) {
            if (filter === 'all') {
              return true;
            }
            if (filter === 'active') {
              return !task.completed;
            }
            if (filter === 'completed') {
              return task.completed;
            }
          })
          .forEach(function(task) {
            if (!task.completed) {
              activeTasks++;
            }
            $('#todo-list').append('<div class="row"><p class="col-xs-6">' + task.content + '</p><button class="btn btn-outline-danger delete" data-id="' + task.id + '">Delete</button><input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '>');
          });
          $('.to-do-amount').text(activeTasks.length);
          console.log(activeTasks);
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }
  

  var createTask = function () {
    $.ajax({
      type: 'POST',
      url: 'https://fewd-todolist-api.onrender.com/tasks?api_key=5',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#new-task-content').val()
        }
      }),
      success: function (response, textStatus) {
        $('#new-task-content').val('');
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });  
  }

  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });
  

  var deleteTask = function (id) {
    $.ajax({
      type: 'DELETE',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '?api_key=5',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });
  

  var markTaskComplete = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_complete?api_key=5',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }


  var markTaskActive = function (id) {
    $.ajax({
      type: 'PUT',
      url: 'https://fewd-todolist-api.onrender.com/tasks/' + id + '/mark_active?api_key=5',
      dataType: 'json',
      success: function (response, textStatus) {
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  $('#all-button').on('click', function () {
    getAndDisplayAllTasks('all');
  });
  $('#remaining-button').on('click', function () {
    getAndDisplayAllTasks('active');
  });
  $('#completed-button').on('click', function () {
    getAndDisplayAllTasks('completed');
  });

  function filteredItems() {
    $(this).addClass('active');
    $(this).siblings().removeClass('active');
  }
  $('.filtered-div button').on('click', filteredItems);
  getAndDisplayAllTasks();

});