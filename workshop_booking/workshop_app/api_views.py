import json
from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .forms import CommentsForm, ProfileForm, UserLoginForm, UserRegistrationForm, WorkshopForm
from .models import AttachmentFile, Comment, Workshop, WorkshopType, department_choices, source, states, title


def json_error(message, status=400, errors=None):
    payload = {"ok": False, "message": message}
    if errors:
        payload["errors"] = errors
    return JsonResponse(payload, status=status)


def parse_json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


def choice_options(choices):
    return [{"value": value, "label": label} for value, label in choices if value != ""]


def is_instructor(user):
    return user.groups.filter(name="instructor").exists()


def serialize_user(user):
    if not user.is_authenticated:
        return None
    profile = getattr(user, "profile", None)
    role = "instructor" if is_instructor(user) else "coordinator"
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_name": user.get_full_name() or user.username,
        "role": role,
        "is_email_verified": bool(profile and profile.is_email_verified),
        "profile": serialize_profile(profile) if profile else None,
    }


def serialize_profile(profile):
    if not profile:
        return None
    return {
        "title": profile.title,
        "institute": profile.institute,
        "department": profile.department,
        "phone_number": profile.phone_number,
        "position": profile.position,
        "location": profile.location,
        "state": profile.state,
        "how_did_you_hear_about_us": profile.how_did_you_hear_about_us,
    }


def serialize_workshop_type(workshop_type):
    attachments = AttachmentFile.objects.filter(workshop_type=workshop_type)
    return {
        "id": workshop_type.id,
        "name": workshop_type.name,
        "description": workshop_type.description,
        "duration": workshop_type.duration,
        "terms_and_conditions": workshop_type.terms_and_conditions,
        "attachments": [
            {
                "id": attachment.id,
                "name": attachment.attachments.name.split("/")[-1],
                "url": attachment.attachments.url,
            }
            for attachment in attachments
        ],
    }


def serialize_comment(comment):
    return {
        "id": comment.id,
        "author": comment.author.get_full_name() or comment.author.username,
        "public": comment.public,
        "comment": comment.comment,
        "created_date": timezone.localtime(comment.created_date).isoformat(),
    }


def serialize_workshop(workshop):
    coordinator_profile = getattr(workshop.coordinator, "profile", None)
    instructor = workshop.instructor
    return {
        "id": workshop.id,
        "uid": str(workshop.uid),
        "date": workshop.date.isoformat(),
        "status": workshop.status,
        "status_label": workshop.get_status(),
        "tnc_accepted": workshop.tnc_accepted,
        "workshop_type": {
            "id": workshop.workshop_type.id,
            "name": workshop.workshop_type.name,
            "duration": workshop.workshop_type.duration,
        },
        "coordinator": {
            "id": workshop.coordinator.id,
            "name": workshop.coordinator.get_full_name() or workshop.coordinator.username,
            "email": workshop.coordinator.email,
            "state": coordinator_profile.state if coordinator_profile else "",
            "state_label": dict(states).get(coordinator_profile.state, "") if coordinator_profile else "",
            "institute": coordinator_profile.institute if coordinator_profile else "",
        },
        "instructor": {
            "id": instructor.id,
            "name": instructor.get_full_name() or instructor.username,
            "email": instructor.email,
        }
        if instructor
        else None,
    }


def dashboard_queryset(user):
    today = timezone.now().date()
    if is_instructor(user):
        return Workshop.objects.filter(Q(instructor=user.id) | Q(status=0, date__gte=today)).order_by("-date")
    return Workshop.objects.filter(coordinator=user.id).order_by("-date")


def workshop_summary(workshops):
    today = timezone.now().date()
    workshop_list = list(workshops)
    return {
        "total": len(workshop_list),
        "pending": len([w for w in workshop_list if w.status == 0]),
        "accepted": len([w for w in workshop_list if w.status == 1]),
        "upcoming": len([w for w in workshop_list if w.date >= today]),
    }


@require_GET
def session_api(request):
    return JsonResponse(
        {
            "ok": True,
            "user": serialize_user(request.user),
            "meta": {
                "titles": choice_options(title),
                "departments": choice_options(department_choices),
                "states": choice_options(states),
                "sources": choice_options(source),
            },
        }
    )


@csrf_exempt
@require_POST
def login_api(request):
    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")
    form = UserLoginForm(data)
    if not form.is_valid():
        return json_error("Login failed.", status=400, errors=form.errors.get_json_data())
    user = form.cleaned_data
    login(request, user)
    if not user.profile.is_email_verified:
        return JsonResponse(
            {
                "ok": True,
                "requires_activation": True,
                "message": "Account created but email verification is still pending.",
                "user": serialize_user(user),
            }
        )
    return JsonResponse({"ok": True, "user": serialize_user(user)})


@csrf_exempt
@require_POST
def logout_api(request):
    logout(request)
    return JsonResponse({"ok": True})


@csrf_exempt
@require_POST
def register_api(request):
    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")
    form = UserRegistrationForm(data)
    if not form.is_valid():
        return json_error("Registration failed.", status=400, errors=form.errors.get_json_data())

    username, password, _key = form.save()
    user = authenticate(username=username, password=password)
    login(request, user)
    return JsonResponse(
        {
            "ok": True,
            "requires_activation": True,
            "message": "Registration submitted. This account still needs email activation in the legacy workflow.",
            "user": serialize_user(user),
        },
        status=201,
    )


@require_GET
def workshop_types_api(request):
    workshop_types = WorkshopType.objects.order_by("id")
    return JsonResponse(
        {
            "ok": True,
            "items": [serialize_workshop_type(workshop_type) for workshop_type in workshop_types],
        }
    )


@require_GET
def dashboard_api(request):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    workshops = list(dashboard_queryset(request.user))
    return JsonResponse(
        {
            "ok": True,
            "summary": workshop_summary(workshops),
            "items": [serialize_workshop(workshop) for workshop in workshops],
        }
    )


@require_GET
def public_stats_api(request):
    workshop_type_id = request.GET.get("workshop_type")
    state = request.GET.get("state")
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    sort = request.GET.get("sort", "-date")

    workshops = Workshop.objects.filter(status=1)

    if from_date and to_date:
        workshops = workshops.filter(date__range=(from_date, to_date))
    if state:
        workshops = workshops.filter(coordinator__profile__state=state)
    if workshop_type_id:
        workshops = workshops.filter(workshop_type_id=workshop_type_id)

    if sort not in ("date", "-date"):
        sort = "-date"
    workshops = workshops.order_by(sort)
    workshop_list = list(workshops)

    state_counts = {}
    type_counts = {}
    for workshop in workshop_list:
        state_label = dict(states).get(workshop.coordinator.profile.state, "")
        state_counts[state_label] = state_counts.get(state_label, 0) + 1
        type_name = workshop.workshop_type.name
        type_counts[type_name] = type_counts.get(type_name, 0) + 1

    return JsonResponse(
        {
            "ok": True,
            "items": [serialize_workshop(workshop) for workshop in workshop_list],
            "charts": {
                "by_state": [{"label": key, "value": value} for key, value in state_counts.items()],
                "by_type": [{"label": key, "value": value} for key, value in type_counts.items()],
            },
        }
    )


@require_GET
def workshop_details_api(request, workshop_id):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return json_error("Workshop not found.", status=404)

    comments = Comment.objects.filter(workshop=workshop).order_by("-created_date")
    if not is_instructor(request.user):
        comments = comments.filter(public=True)

    return JsonResponse(
        {
            "ok": True,
            "item": serialize_workshop(workshop),
            "comments": [serialize_comment(comment) for comment in comments],
        }
    )


@csrf_exempt
@require_POST
def workshop_comment_api(request, workshop_id):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return json_error("Workshop not found.", status=404)

    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")
    form = CommentsForm(data)
    if not form.is_valid():
        return json_error("Comment could not be saved.", errors=form.errors.get_json_data())

    comment = form.save(commit=False)
    if not is_instructor(request.user):
        comment.public = True
    comment.author = request.user
    comment.workshop = workshop
    comment.created_date = timezone.now()
    comment.save()
    return JsonResponse({"ok": True, "comment": serialize_comment(comment)}, status=201)


@csrf_exempt
@require_POST
def propose_workshop_api(request):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    if is_instructor(request.user):
        return json_error("Only coordinators can propose workshops.", status=403)

    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")
    form = WorkshopForm(
        {
            "workshop_type": data.get("workshop_type"),
            "date": data.get("date"),
            "tnc_accepted": data.get("tnc_accepted"),
        }
    )
    if not form.is_valid():
        return json_error("Workshop proposal failed.", errors=form.errors.get_json_data())

    workshop = form.save(commit=False)
    workshop.coordinator = request.user
    if Workshop.objects.filter(
        date=workshop.date,
        workshop_type=workshop.workshop_type,
        coordinator=workshop.coordinator,
    ).exists():
        return json_error("You already proposed this workshop on the selected date.")
    workshop.save()
    return JsonResponse({"ok": True, "item": serialize_workshop(workshop)}, status=201)


@csrf_exempt
@require_POST
def accept_workshop_api(request, workshop_id):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    if not is_instructor(request.user):
        return json_error("Only instructors can accept workshops.", status=403)
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return json_error("Workshop not found.", status=404)

    workshop.status = 1
    workshop.instructor = request.user
    workshop.save()
    return JsonResponse({"ok": True, "item": serialize_workshop(workshop)})


@csrf_exempt
@require_POST
def change_workshop_date_api(request, workshop_id):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    if not is_instructor(request.user):
        return json_error("Only instructors can update workshop dates.", status=403)
    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return json_error("Workshop not found.", status=404)

    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")
    try:
        new_date = datetime.strptime(data.get("date", ""), "%Y-%m-%d").date()
    except ValueError:
        return json_error("A valid date is required.")

    if new_date < timezone.now().date():
        return json_error("Workshop date cannot be in the past.")

    workshop.date = new_date
    workshop.save()
    return JsonResponse({"ok": True, "item": serialize_workshop(workshop)})


@require_GET
def profile_api(request):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)
    return JsonResponse({"ok": True, "profile": serialize_user(request.user)})


@csrf_exempt
@require_POST
def update_profile_api(request):
    if not request.user.is_authenticated:
        return json_error("Authentication required.", status=401)

    data = parse_json_body(request)
    if data is None:
        return json_error("Invalid JSON payload.")

    user = request.user
    profile = user.profile
    form = ProfileForm(
        {
            "first_name": data.get("first_name"),
            "last_name": data.get("last_name"),
            "title": data.get("title"),
            "institute": data.get("institute"),
            "department": data.get("department"),
            "phone_number": data.get("phone_number"),
            "position": profile.position,
            "location": data.get("location"),
            "state": data.get("state"),
        },
        user=user,
        instance=profile,
    )
    if not form.is_valid():
        return json_error("Profile update failed.", errors=form.errors.get_json_data())

    updated_profile = form.save(commit=False)
    updated_profile.user = user
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.save()
    updated_profile.save()
    return JsonResponse({"ok": True, "profile": serialize_user(user)})
