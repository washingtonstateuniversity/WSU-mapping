<%@ Page Language="C#" %>
<script runat="server">
  protected override void OnLoad(EventArgs e)
  {
    Response.Redirect("~/central");
    base.OnLoad(e);
  }
</script>
