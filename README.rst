Please License
==============

You put in a github username and it makes some API calls and looks at that
user's public repos. It naively looks for LICENSE information, README files,
and CONTRIBUTING files at the top level of the repo.

My design goal is to have everything run on the client side. 

Future Work
-----------

* Repos missing LICENSE get a button to file an issue with a
  pre-filled "LICENSE files are cool" template

* Repos missing README files get a button to file an issue, and a button to
  fork and open a PR with the README file in the editor pre-populated with
  issue tagline and name

* Repos missing CONTRIBUTING files get a button to file an issue, and a button
  to PR a standard CONTRIBUTING file that says to contact the core contributor
  (based on gh stats), or copies an existing CONTRIBUTING file if it's an org

* Maybe something about CONDUCT? 
