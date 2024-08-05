import { BASE_URL } from "./Endpoints";

export const eventTypeOptions = [
    {label : 'Click',value : 'click'},
    {label : 'Hover',value : 'hover'},
    {label : 'Scroll',value : 'scroll'},
    {label : 'Submit',value : 'submit'},
    {label : 'View',value : 'view'},
    {label : 'Hover',value : 'hover'},
    {label : 'Other',value : 'other'},
]

function getProductUsageSnippetURL(){
    return `${BASE_URL}/usage/feedbacksense/v1`;
}

export const getProductUsageScript = (orgId : string) => {
    return `<script>
      var feedbacksense_options = {
        organization_id: "${orgId}", //Do not change this
        person: {
          id: "john@doe.com", //Replace with person email address
          identifierType: "email",
          name: "John Doe", //Replace with person name
        },
        company: {
          id: "ibx9-ax2w-axi13-xx4t",
          name: "Acme",
        },
      }
      window.feedbacksense_tmp_stack = [];
      window["feedbacksense"] = {
        go: function () {return -1;},
        setAccountAttributes: function () {},
        identify: function () {},
        track: function (t) {window.feedbacksense_tmp_stack.push({activity: t,personId: feedbacksense_options.person.id,companyId: feedbacksense_options.company.id,name: feedbacksense_options.person.name,companyName: feedbacksense_options.company.name,org: feedbacksense_options.organization_id,createdDate: new Date().toISOString(),});
          return -1;
        },
      };
      var e = document.createElement("script");
      e.type = "text/javascript";
      e.async = true;
      e.src = "${getProductUsageSnippetURL()}";
      var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(e, s);
  </script>`;
}