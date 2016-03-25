{
    'name': 'Islamic Calendar',
    'version': '1.0',
    'category': 'General',
    "sequence": 16,
    'description': """Islamic Calender Field for Odoo""",
    'author': 'Bista Solutions Pvt. Ltd.',
    'depends': ['base', 'web'],
    'init_xml': [],
    'data': [
        'res_users_view.xml',
        'view/islamic_calendar_view.xml',
    ],
    'qweb': [
        'static/src/xml/islamic_calendar.xml',
    ],
    'demo_xml': [],
    'test': [],
    'installable': True,
    'auto_install': False,
}
