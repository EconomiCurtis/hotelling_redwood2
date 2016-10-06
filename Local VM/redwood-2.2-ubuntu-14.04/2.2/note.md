on virtual machine, inital login credentials (id/pw) is `vagrant`/`vagrant`

GET http://192.168.33.10/static/admin/css/base.css                     
GET http://192.168.33.10/static/admin/css/forms.css                    (index):6
GET http://192.168.33.10/static/admin/ace/ace_editor.css               (index):15
GET http://192.168.33.10/static/admin/js/admin/RelatedObjectLookups.js (index):17
GET http://192.168.33.10/static/admin/js/core.js                       (index):16
GET http://192.168.33.10/static/admin/js/jquery.min.js                 (index):18
GET http://192.168.33.10/static/admin/js/jquery.init.js                (index):19
GET http://192.168.33.10/static/admin/js/actions.min.js                (index):20
GET http://192.168.33.10/static/admin/ace/ace_editor.js                (index):22
GET http://192.168.33.10/static/admin/ace/ace.js                       (index):21
GET http://192.168.33.10/static/admin/ace/mode-html.js                 (index):23
GET http://192.168.33.10/static/admin/ace/mode-css.js                  (index):24
GET http://192.168.33.10/static/admin/ace/mode-javascript.js           (index):25
GET http://192.168.33.10/static/admin/js/jquery.cookie.js              (index):29
GET http://192.168.33.10/static/admin/js/inlines.min.js                (index):26
GET http://192.168.33.10/static/admin/js/shortcut.js                   (index):30
GET http://192.168.33.10/static/admin/img/icon_addlink.gif 404 (Not Found) (index):240

##Sept 27, 2016
An experiment consists of a CSV and a JSON.
The CSV stores variables that differs for every session.
If you run into a "Could not connect to router" it could be because you haven't started the redwood-router.
Start it by `sudo start redwood-router` or disable the firewall (maybe of the local machine or the server).	