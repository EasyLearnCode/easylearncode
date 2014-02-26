from webapp2_extras.routes import RedirectRoute
import users
import handlers


_routes = [
    RedirectRoute('/admin/logout/', users.AdminLogoutHandler, name='admin-logout', strict_slash=True),
    RedirectRoute('/admin/courses', handlers.AdminCourseHandler, name='admin-course', strict_slash=True),
    RedirectRoute('/admin/users/', users.AdminUserListHandler, name='user-list', strict_slash=True),
    RedirectRoute('/admin/users/<user_id>/', users.AdminUserEditHandler, name='user-edit', strict_slash=True, handler_method='edit'),
    RedirectRoute('/admin/weekly_quiz', handlers.WeeklyQuizHandler, name='weekly-quiz', strict_slash=True),
    RedirectRoute('/admin/weekly_quiz/gets', handlers.GetWeeklyQuizHandler, name='get-weekly-quiz', strict_slash=True),
    RedirectRoute('/admin/weekly_quiz/gets', handlers.GetWeeklyQuizHandler, name='get-weekly-quiz', strict_slash=True),
    RedirectRoute('/admin/', users.AdminHomeHandler, name='admin-home', strict_slash=True),
]

def get_routes():
    return _routes

def add_routes(app):
    for r in _routes:
        app.router.add(r)
